const { validationResult } = require('express-validator')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const { sendMailIfConfigured, sendCustomerMailIfConfigured } = require('../utils/mailer')

async function createOrder(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({ errors: errors.array() })
    }

    const { items, deliveryDetails, paymentMethod, paymentStatus, paymentReference } = req.body

    const normalized = []
    for (const item of items) {
      const productId = item.productId
      const qty = Math.max(1, Number(item.qty) || 1)

      if (qty > 20) {
        res.status(400)
        throw new Error('For orders above 20 quantity, please contact us.')
      }

      const product = await Product.findOne({ productId })
      if (!product) {
        res.status(400)
        throw new Error(`Invalid productId: ${productId}`)
      }

      const stockValue = Number(product.stock)
      const hasStock = Number.isFinite(stockValue) && stockValue >= 0
      if (hasStock) {
        const updated = await Product.findOneAndUpdate(
          { productId, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true },
        )
        if (!updated) {
          res.status(400)
          throw new Error(`Insufficient stock for ${product.name}. Available: ${Math.max(0, stockValue)}`)
        }
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

    const method =
      paymentMethod === 'card' || paymentMethod === 'telephone' || paymentMethod === 'paypal' ? paymentMethod : 'unknown'
    const inferredPaymentStatus = method === 'card' || method === 'paypal' ? 'paid' : 'pending'
    const statusValue = method === 'card' || method === 'paypal' ? 'paid' : 'created'

    const order = await Order.create({
      user: req.user?._id,
      items: normalized,
      subtotal,
      total: subtotal,
      currency: 'USD',
      deliveryDetails: deliveryDetails && typeof deliveryDetails === 'object' ? deliveryDetails : null,
      paymentMethod: method,
      paymentReference: typeof paymentReference === 'string' ? paymentReference : '',
      paymentStatus: paymentStatus === 'paid' || paymentStatus === 'failed' || paymentStatus === 'pending' ? paymentStatus : inferredPaymentStatus,
      status: statusValue,
    })

    try {
      const to = process.env.ORDER_NOTIFY_EMAIL || process.env.ADMIN_EMAIL
      const lines = [
        `Order ID: ${order._id}`,
        `Status: ${order.status}`,
        `Payment: ${order.paymentStatus} (${order.paymentMethod})`,
        `Total: ${order.total} ${order.currency}`,
        '',
        'Items:',
        ...normalized.map((i) => `- ${i.name} (${i.productId}) x${i.qty} = ${i.lineTotal}`),
      ]

      if (to) {
        await sendMailIfConfigured({
          to,
          subject: `New Order Received (${order._id})`,
          text: lines.join('\n'),
        })
      }

      const customerEmail = req.user?.email
      if (customerEmail) {
        await sendCustomerMailIfConfigured({
          to: customerEmail,
          subject: 'Your order has been received',
          text: ['Thanks for your order.', '', ...lines].join('\n'),
        })
      }
    } catch (e) {
      console.error('Order email failed:', e?.message || e)
    }

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

async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    const nextStatus = String(req.body?.status || '').trim()
    const allowed = ['created', 'paid', 'shipped', 'completed', 'cancelled']
    if (!allowed.includes(nextStatus)) {
      res.status(400)
      throw new Error('Invalid status')
    }

    order.status = nextStatus
    const saved = await order.save()
    res.json(saved)
  } catch (err) {
    next(err)
  }
}

module.exports = { createOrder, listOrders, listAllOrders, getOrder, updateOrderStatus }
