const express = require('express')

const { protect, adminOnly } = require('../middleware/authMiddleware')
const { listUsers } = require('../controllers/userController')
const { listContacts, updateContact, deleteContact } = require('../controllers/contactController')
const { listAllOrders, getOrder } = require('../controllers/orderController')
const { listConsultations, updateConsultation } = require('../controllers/consultationController')
const { listProductsAdmin } = require('../controllers/productController')

const router = express.Router()

router.use(protect, adminOnly)

router.get('/users', listUsers)

router.get('/products', listProductsAdmin)

router.get('/contacts', listContacts)
router.put('/contacts/:id', updateContact)
router.delete('/contacts/:id', deleteContact)

router.get('/orders', listAllOrders)
router.get('/orders/:id', getOrder)

router.get('/consultations', listConsultations)
router.put('/consultations/:id', updateConsultation)

module.exports = router
