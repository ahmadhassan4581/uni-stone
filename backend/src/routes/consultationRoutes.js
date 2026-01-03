const express = require('express')
const { body } = require('express-validator')

const {
  createConsultation,
  listConsultations,
  updateConsultation,
} = require('../controllers/consultationController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
  '/',
  [
    body('track')
      .isString()
      .custom((v) => ['Concept Review', 'Site Walkthrough', 'Executive Advisory'].includes(v))
      .withMessage('Invalid track'),
    body('notes').optional().isString(),
  ],
  createConsultation,
)

// If you want consultations to be user-scoped, use protect
router.get('/', protect, listConsultations)
router.put('/:id', protect, updateConsultation)

module.exports = router
