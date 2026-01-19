const { validationResult } = require('express-validator')
const NewsletterSubscription = require('../models/newsletterModel')

async function createNewsletterSubscription(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const email = String(req.body.email || '').trim().toLowerCase()
    const source = String(req.body.source || 'footer').trim() || 'footer'

    let doc = await NewsletterSubscription.findOne({ email })
    if (!doc) {
      doc = await NewsletterSubscription.create({ email, source })
    }

    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
}

async function listNewsletterSubscriptions(req, res, next) {
  try {
    const items = await NewsletterSubscription.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

async function deleteNewsletterSubscription(req, res, next) {
  try {
    const deleted = await NewsletterSubscription.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404)
      throw new Error('Newsletter subscription not found')
    }
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createNewsletterSubscription, listNewsletterSubscriptions, deleteNewsletterSubscription }
