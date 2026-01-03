const express = require('express')
const { body } = require('express-validator')

const { createOrder, listOrders, listAllOrders, getOrder } = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Items are required'),
    body('items.*.productId').isString().withMessage('productId is required'),
    body('items.*.qty').optional().isNumeric(),
  ],
  createOrder,
)

router.get('/', protect, listOrders)
router.get('/admin/all', protect, adminOnly, listAllOrders)
router.get('/:id', protect, getOrder)

module.exports = router
