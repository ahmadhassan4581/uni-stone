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

async function sendNewsletterToAll(req, res, next) {
  try {
    const subject = String(req.body?.subject || '').trim()
    const message = String(req.body?.message || '').trim()

    if (!subject || !message) {
      res.status(400)
      throw new Error('Subject and message are required')
    }

    const subs = await NewsletterSubscription.find({}, { email: 1 }).sort({ createdAt: -1 })
    const emails = subs.map((s) => String(s.email || '').trim().toLowerCase()).filter(Boolean)

    const uniqueEmails = Array.from(new Set(emails))
    if (!uniqueEmails.length) {
      return res.json({ ok: true, total: 0, sentBatches: 0, failedBatches: 0 })
    }

    const batchSize = Math.max(1, Number(process.env.NEWSLETTER_BCC_BATCH_SIZE) || 50)
    let sentBatches = 0
    let failedBatches = 0

    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize)
      try {
        const ok = await sendMailIfConfigured({
          to: process.env.NEWSLETTER_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER,
          bcc: batch,
          subject,
          text: message,
        })
        if (ok) sentBatches += 1
        else failedBatches += 1
      } catch (e) {
        failedBatches += 1
        console.error('Newsletter bulk email batch failed:', e?.message || e)
      }
    }

    res.json({ ok: true, total: uniqueEmails.length, sentBatches, failedBatches })
  } catch (err) {
    next(err)
  }
}

module.exports = { createNewsletterSubscription, listNewsletterSubscriptions, deleteNewsletterSubscription, sendNewsletterToAll }
