const express = require('express')
const { body } = require('express-validator')

const { register, login, me } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').optional().custom((value, { req }) => {
      if (value && value !== req.body.password) throw new Error('Passwords do not match')
      return true
    }),
  ],
  register,
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login,
)

router.get('/me', protect, me)

module.exports = router
