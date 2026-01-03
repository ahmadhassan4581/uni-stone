const express = require('express')

const {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', listProducts)
router.get('/:slug', getProductBySlug)

// Admin CRUD placeholders (no admin UI in frontend; left open for future use)
router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

module.exports = router
