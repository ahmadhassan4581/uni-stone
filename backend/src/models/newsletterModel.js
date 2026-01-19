const mongoose = require('mongoose')

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    source: { type: String, trim: true, default: 'footer' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('NewsletterSubscription', newsletterSchema)
