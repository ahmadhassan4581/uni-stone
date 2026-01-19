const express = require('express')
const { body } = require('express-validator')

const { createNewsletterSubscription } = require('../controllers/newsletterController')

const router = express.Router()

router.post('/', [body('email').isEmail().withMessage('Valid email is required')], createNewsletterSubscription)

module.exports = router
