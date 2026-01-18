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
      .custom((v) => ['Free Stone Consultation', 'Concept Review', 'Site Walkthrough', 'Executive Advisory'].includes(v))
      .withMessage('Invalid track'),
    body('scheduleDateIso').isString().withMessage('scheduleDateIso is required'),
    body('scheduleTime').isString().withMessage('scheduleTime is required'),
    body('scheduleDateLabel').optional().isString(),
    body('customerName').optional().isString(),
    body('customerPhone').isString().withMessage('customerPhone is required'),
    body('customerEmail').optional().isString(),
    body('notes').optional().isString(),
  ],
  createConsultation,
)

// If you want consultations to be user-scoped, use protect
router.get('/', protect, listConsultations)
router.put('/:id', protect, updateConsultation)

module.exports = router
