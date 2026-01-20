const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')

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

module.exports = { register, login, me, getWishlist, addWishlistItem, removeWishlistItem }
