const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: 'Home' },
    fullName: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    address1: { type: String, trim: true, default: '' },
    town: { type: String, trim: true, default: '' },
    county: { type: String, trim: true, default: '' },
    postcode: { type: String, trim: true, default: '' },
    telephone: { type: String, trim: true, default: '' },
  },
  { _id: true },
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordTokenHash: { type: String, default: '' },
    resetPasswordExpiresAt: { type: Date, default: null },
    isAdmin: { type: Boolean, default: false },
    wishlist: { type: [String], default: [] },
    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
