const { validationResult } = require('express-validator')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')

async function createOrder(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const { items } = req.body

    const normalized = []
    for (const item of items) {
      const productId = item.productId
      const qty = Math.max(1, Number(item.qty) || 1)

      const product = await Product.findOne({ productId })
      if (!product) {
        res.status(400)
        throw new Error(`Invalid productId: ${productId}`)
      }

      normalized.push({
        product: product._id,
        productId: product.productId,
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        image: product.image,
        price: product.price,
        qty,
        lineTotal: product.price * qty,
      })
    }

    const subtotal = normalized.reduce((sum, i) => sum + i.lineTotal, 0)
    const order = await Order.create({
      user: req.user?._id,
      items: normalized,
      subtotal,
      total: subtotal,
      currency: 'USD',
    })

    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

async function listOrders(req, res, next) {
  try {
    const filter = req.user ? { user: req.user._id } : {}
    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

async function listAllOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    const isAdmin = Boolean(req.user?.isAdmin)
    const isOwner = order.user && req.user && String(order.user) === String(req.user._id)
    if (!isAdmin && !isOwner) {
      res.status(403)
      throw new Error('Not authorized to access this order')
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

module.exports = { createOrder, listOrders, listAllOrders, getOrder }
