const { validationResult } = require('express-validator')
const Consultation = require('../models/consultationModel')

const TRACK_FEES = {
  'Concept Review': 150,
  'Site Walkthrough': 350,
  'Executive Advisory': 650,
}

async function createConsultation(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const { track, notes } = req.body
    const fee = TRACK_FEES[track]
    if (!fee) {
      res.status(400)
      throw new Error('Invalid track')
    }

    const doc = await Consultation.create({
      user: req.user?._id,
      track,
      fee,
      notes,
      currency: 'USD',
    })

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

module.exports = { createConsultation, listConsultations, updateConsultation }
