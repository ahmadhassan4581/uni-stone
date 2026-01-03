const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      res.status(401)
      throw new Error('Not authorized, token missing')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      res.status(500)
      throw new Error('JWT_SECRET is not set')
    }

    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      res.status(401)
      throw new Error('Not authorized, user not found')
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

function adminOnly(req, res, next) {
  try {
    if (!req.user) {
      res.status(401)
      throw new Error('Not authorized')
    }
    if (!req.user.isAdmin) {
      res.status(403)
      throw new Error('Admin access required')
    }
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { protect, adminOnly }
