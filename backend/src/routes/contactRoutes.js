const express = require('express')
const { body } = require('express-validator')

const {
  createContact,
  listContacts,
  updateContact,
  deleteContact,
} = require('../controllers/contactController')

const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().isString(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createContact,
)

// Admin endpoints (no admin UI in frontend)
router.get('/', protect, adminOnly, listContacts)
router.put('/:id', protect, adminOnly, updateContact)
router.delete('/:id', protect, adminOnly, deleteContact)

module.exports = router
