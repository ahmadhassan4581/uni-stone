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
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

async function me(req, res) {
  res.json(req.user)
}

module.exports = { register, login, me }
