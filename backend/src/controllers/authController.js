const { validationResult } = require('express-validator')
const crypto = require('crypto')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const { sendCustomerMailIfConfigured } = require('../utils/mailer')

async function register(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    const normalizedEmail = String(email).toLowerCase()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      res.status(400)
      throw new Error('User already exists')
    }

    const userCount = await User.countDocuments()
    const isFirstUser = userCount === 0

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      isAdmin: isFirstUser,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email: String(email).toLowerCase() })
    if (!user) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    const ok = await user.matchPassword(password)
    if (!ok) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

async function me(req, res) {
  res.json(req.user)
}

async function getWishlist(req, res) {
  res.json({ wishlist: Array.isArray(req.user?.wishlist) ? req.user.wishlist : [] })
}

async function addWishlistItem(req, res, next) {
  try {
    const productId = String(req.body?.productId || '').trim()
    if (!productId) {
      res.status(400)
      throw new Error('productId is required')
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      res.status(401)
      throw new Error('Not authorized')
    }

    const current = Array.isArray(user.wishlist) ? user.wishlist : []
    if (!current.includes(productId)) current.push(productId)
    user.wishlist = current
    await user.save()

    res.json({ wishlist: user.wishlist })
  } catch (err) {
    next(err)
  }
}

async function getAddresses(req, res) {
  res.json({ addresses: Array.isArray(req.user?.addresses) ? req.user.addresses : [] })
}

async function updateAddresses(req, res, next) {
  try {
    const addresses = Array.isArray(req.body?.addresses) ? req.body.addresses : null
    if (!addresses) {
      res.status(400)
      throw new Error('addresses must be an array')
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      res.status(401)
      throw new Error('Not authorized')
    }

    user.addresses = addresses
    await user.save()
    res.json({ addresses: user.addresses })
  } catch (err) {
    next(err)
  }
}

async function removeWishlistItem(req, res, next) {
  try {
    const productId = String(req.params?.productId || '').trim()
    if (!productId) {
      res.status(400)
      throw new Error('productId is required')
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      res.status(401)
      throw new Error('Not authorized')
    }

    const current = Array.isArray(user.wishlist) ? user.wishlist : []
    user.wishlist = current.filter((id) => id !== productId)
    await user.save()

    res.json({ wishlist: user.wishlist })
  } catch (err) {
    next(err)
  }
}

async function forgotPassword(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const email = String(req.body?.email || '').trim().toLowerCase()
    const user = await User.findOne({ email })

    // Do not reveal whether the email exists
    if (!user) {
      return res.json({ ok: true })
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    user.resetPasswordTokenHash = tokenHash
    user.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 30)
    await user.save()

    const appUrl = String(process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
    const resetUrl = `${appUrl}/account?resetToken=${encodeURIComponent(rawToken)}`

    try {
      await sendCustomerMailIfConfigured({
        to: user.email,
        subject: 'Reset your password',
        text: [
          'We received a request to reset your password.',
          '',
          `Reset link: ${resetUrl}`,
          '',
          'If you did not request this, you can ignore this email.',
        ].join('\n'),
      })
    } catch (e) {
      console.error('Forgot password email failed:', e?.message || e)
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

async function resetPassword(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const rawToken = String(req.body?.token || '').trim()
    const password = String(req.body?.password || '')

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    })

    if (!user) {
      res.status(400)
      throw new Error('Invalid or expired reset token')
    }

    user.password = password
    user.resetPasswordTokenHash = ''
    user.resetPasswordExpiresAt = null
    await user.save()

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  me,
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  getAddresses,
  updateAddresses,
  forgotPassword,
  resetPassword,
}
