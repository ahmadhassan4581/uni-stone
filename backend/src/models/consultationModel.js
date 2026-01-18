const mongoose = require('mongoose')

const consultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    track: {
      type: String,
      required: true,
      enum: ['Free Stone Consultation', 'Concept Review', 'Site Walkthrough', 'Executive Advisory'],
    },
    fee: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: { type: String, enum: ['requested', 'scheduled', 'completed', 'cancelled'], default: 'requested' },
    scheduledAt: { type: Date },
    scheduleDateIso: { type: String, required: true },
    scheduleTime: { type: String, required: true },
    scheduleDateLabel: { type: String },
    customerName: { type: String },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Consultation', consultationSchema)
