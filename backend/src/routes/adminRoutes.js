const express = require('express')

const { protect, adminOnly } = require('../middleware/authMiddleware')
const { listUsers } = require('../controllers/userController')
const { listContacts, updateContact, deleteContact } = require('../controllers/contactController')
const { listAllOrders, getOrder, updateOrderStatus } = require('../controllers/orderController')
const { listConsultations, updateConsultation } = require('../controllers/consultationController')
const { listProductsAdmin, listAllReviewsAdmin, updateReviewAdmin, deleteReviewAdmin } = require('../controllers/productController')
const { listNewsletterSubscriptions, deleteNewsletterSubscription, sendNewsletterToAll } = require('../controllers/newsletterController')

const router = express.Router()

router.use(protect, adminOnly)

router.get('/users', listUsers)

router.get('/products', listProductsAdmin)

router.get('/reviews', listAllReviewsAdmin)
router.put('/reviews/:slug/:reviewId', updateReviewAdmin)
router.delete('/reviews/:slug/:reviewId', deleteReviewAdmin)

router.get('/contacts', listContacts)
router.put('/contacts/:id', updateContact)
router.delete('/contacts/:id', deleteContact)

router.get('/orders', listAllOrders)
router.get('/orders/:id', getOrder)
router.put('/orders/:id/status', updateOrderStatus)

router.get('/consultations', listConsultations)
router.put('/consultations/:id', updateConsultation)

router.get('/newsletter', listNewsletterSubscriptions)
router.post('/newsletter/send', sendNewsletterToAll)
router.delete('/newsletter/:id', deleteNewsletterSubscription)

module.exports = router
