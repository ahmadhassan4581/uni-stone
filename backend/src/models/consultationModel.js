const mongoose = require('mongoose')

const consultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    track: {
      type: String,
      required: true,
      enum: ['Concept Review', 'Site Walkthrough', 'Executive Advisory'],
    },
    fee: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: { type: String, enum: ['requested', 'scheduled', 'completed', 'cancelled'], default: 'requested' },
    scheduledAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Consultation', consultationSchema)
