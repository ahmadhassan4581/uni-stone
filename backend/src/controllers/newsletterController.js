const { validationResult } = require('express-validator')
const NewsletterSubscription = require('../models/newsletterModel')
const { sendMailIfConfigured, sendCustomerMailIfConfigured } = require('../utils/mailer')

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

    try {
      const to = process.env.NEWSLETTER_NOTIFY_EMAIL
      if (to) {
        await sendMailIfConfigured({
          to,
          subject: 'New Newsletter Subscription',
          text: [`Email: ${email}`, `Source: ${source}`].join('\n'),
        })
      }

      if (email) {
        await sendCustomerMailIfConfigured({
          to: email,
          subject: 'You are subscribed to our newsletter',
          text: ['Thanks for subscribing to our newsletter.'].join('\n'),
        })
      }
    } catch (e) {
      console.error('Newsletter email failed:', e?.message || e)
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
