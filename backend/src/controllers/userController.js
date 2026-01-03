const User = require('../models/userModel')

async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}

module.exports = { listUsers }
