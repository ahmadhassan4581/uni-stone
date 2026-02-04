const { validationResult } = require('express-validator')
const Consultation = require('../models/consultationModel')
const { sendMailIfConfigured, sendCustomerMailIfConfigured } = require('../utils/mailer')

const TRACK_FEES = {
  'Free Stone Consultation': 0,
  'Concept Review': 150,
  'Site Walkthrough': 350,
  'Executive Advisory': 650,
}

async function sendConsultationEmailIfConfigured(payload) {
  const to = process.env.CONSULTATION_NOTIFY_EMAIL
  if (!to) return

  const lines = [
    `Track: ${payload.track}`,
    `Date: ${payload.scheduleDateLabel || payload.scheduleDateIso}`,
    `Time: ${payload.scheduleTime}`,
    `Name: ${payload.customerName || ''}`,
    `Phone: ${payload.customerPhone}`,
    `Email: ${payload.customerEmail || ''}`,
    `Notes: ${payload.notes || ''}`,
  ]

  await sendMailIfConfigured({
    to,
    subject: `New Consultation Request (${payload.track})`,
    text: lines.join('\n'),
  })

  if (payload.customerEmail) {
    await sendCustomerMailIfConfigured({
      to: payload.customerEmail,
      subject: 'Your consultation request has been received',
      text: [
        'Thanks for your request. We will contact you shortly.',
        '',
        `Requested: ${payload.track}`,
        `Date: ${payload.scheduleDateLabel || payload.scheduleDateIso}`,
        `Time: ${payload.scheduleTime}`,
      ].join('\n'),
    })
  }
}

async function createConsultation(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const {
      track,
      notes,
      scheduleDateIso,
      scheduleTime,
      scheduleDateLabel,
      customerName,
      customerPhone,
      customerEmail,
    } = req.body
    const fee = TRACK_FEES[track]
    if (fee === undefined) {
      res.status(400)
      throw new Error('Invalid track')
    }

    const doc = await Consultation.create({
      user: req.user?._id,
      track,
      fee,
      notes,
      currency: 'USD',
      paymentStatus: fee > 0 ? 'pending' : 'paid',
      scheduleDateIso,
      scheduleTime,
      scheduleDateLabel,
      customerName,
      customerPhone,
      customerEmail,
    })

    try {
      await sendConsultationEmailIfConfigured({
        track,
        scheduleDateIso,
        scheduleTime,
        scheduleDateLabel,
        customerName,
        customerPhone,
        customerEmail,
        notes,
      })
    } catch (e) {
      console.error('Consultation email failed:', e?.message || e)
    }

    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
}

async function listConsultations(req, res, next) {
  try {
    const filter = req.user?.isAdmin ? {} : { user: req.user._id }
    const items = await Consultation.find(filter).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

async function updateConsultation(req, res, next) {
  try {
    const doc = await Consultation.findById(req.params.id)
    if (!doc) {
      res.status(404)
      throw new Error('Consultation not found')
    }

    const isAdmin = Boolean(req.user?.isAdmin)
    const isOwner = doc.user && req.user && String(doc.user) === String(req.user._id)
    if (!isAdmin && !isOwner) {
      res.status(403)
      throw new Error('Not authorized to update this consultation')
    }

    Object.assign(doc, req.body)
    const saved = await doc.save()
    res.json(saved)
  } catch (err) {
    next(err)
  }
}

async function sendConsultationEmailAdmin(req, res, next) {
  try {
    const doc = await Consultation.findById(req.params.id)
    if (!doc) {
      res.status(404)
      throw new Error('Consultation not found')
    }

    const to = String(doc.customerEmail || '').trim()
    if (!to) {
      res.status(400)
      throw new Error('Customer email is missing')
    }

    const subject = String(req.body?.subject || '').trim()
    const message = String(req.body?.message || '').trim()
    if (!subject || !message) {
      res.status(400)
      throw new Error('Subject and message are required')
    }

    const ok = await sendMailIfConfigured({
      to,
      subject,
      text: message,
    })

    if (!ok) {
      res.status(500)
      throw new Error('Email service is not configured')
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { createConsultation, listConsultations, updateConsultation, sendConsultationEmailAdmin }
