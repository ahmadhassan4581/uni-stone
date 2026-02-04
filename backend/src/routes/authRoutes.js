const express = require('express')
const { body } = require('express-validator')

const {
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
  changePassword,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match')
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

router.post('/forgot-password', [body('email').isEmail().withMessage('Valid email is required')], forgotPassword)

router.post(
  '/reset-password',
  [
    body('token').trim().notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match')
      return true
    }),
  ],
  resetPassword,
)

router.get('/me', protect, me)

router.get('/wishlist', protect, getWishlist)
router.post('/wishlist', protect, [body('productId').trim().notEmpty().withMessage('productId is required')], addWishlistItem)
router.delete('/wishlist/:productId', protect, removeWishlistItem)

router.get('/addresses', protect, getAddresses)
router.put('/addresses', protect, updateAddresses)

router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match')
      return true
    }),
  ],
  changePassword,
)

module.exports = router
