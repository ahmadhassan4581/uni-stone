const { validationResult } = require('express-validator')
const Contact = require('../models/contactModel')
const { sendMailIfConfigured, sendCustomerMailIfConfigured } = require('../utils/mailer')

async function createContact(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const { name, email, phone, message } = req.body

    const doc = await Contact.create({ name, email, phone, message })

    try {
      const to = process.env.CONTACT_NOTIFY_EMAIL
      if (to) {
        await sendMailIfConfigured({
          to,
          subject: 'New Contact Form Submission',
          text: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || ''}`, '', message].join('\n'),
        })
      }

      if (email) {
        await sendCustomerMailIfConfigured({
          to: email,
          subject: 'We received your message',
          text: ['Thanks for contacting us. We will get back to you shortly.', '', 'Your message:', message].join('\n'),
        })
      }
    } catch (e) {
      console.error('Contact email failed:', e?.message || e)
    }

    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
}

async function listContacts(req, res, next) {
  try {
    const items = await Contact.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

async function updateContact(req, res, next) {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) {
      res.status(404)
      throw new Error('Contact not found')
    }
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

async function deleteContact(req, res, next) {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404)
      throw new Error('Contact not found')
    }
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createContact, listContacts, updateContact, deleteContact }
