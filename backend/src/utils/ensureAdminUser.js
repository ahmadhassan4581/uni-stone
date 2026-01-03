const User = require('../models/userModel')

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) return

  const existing = await User.findOne({ email: String(email).toLowerCase() })
  if (existing) {
    if (!existing.isAdmin) {
      existing.isAdmin = true
      await existing.save()
      console.log('Updated existing user to admin:', existing.email)
    }
    return
  }

  const admin = await User.create({
    name: 'Admin',
    email: String(email).toLowerCase(),
    password,
    isAdmin: true,
  })

  console.log('Created admin user:', admin.email)
}

module.exports = ensureAdminUser
