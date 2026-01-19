const Product = require('../models/productModel')
const seedProducts = require('../data/productsSeed')

async function ensureSeeded() {
  if (String(process.env.SEED_PRODUCTS || '').toLowerCase() === 'false') return
  const count = await Product.countDocuments()
  if (count > 0) return
  await Product.insertMany(seedProducts)
}

async function listProducts(req, res, next) {
  try {
    await ensureSeeded()

    const { category, slug, q, sort } = req.query

    const filter = {}
    if (category) filter.category = category
    if (slug) filter.slug = slug
    if (q) filter.name = { $regex: String(q), $options: 'i' }

    const query = Product.find(filter)

    if (sort === 'price_asc') query.sort({ price: 1 })
    if (sort === 'price_desc') query.sort({ price: -1 })
    if (sort === 'name_asc') query.sort({ name: 1 })
    if (sort === 'name_desc') query.sort({ name: -1 })

    const items = await query.exec()

    res.json(items.map((p) => ({
      id: p.productId,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating ?? null,
      vatRate: p.vatRate ?? null,
      stock: p.stock ?? null,
      description: p.description,
      bullets: p.bullets,
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
      images: Array.isArray(p.images) && p.images.length ? p.images : [p.image].filter(Boolean),
      image: p.image,
    })))
  } catch (err) {
    next(err)
  }
}

async function getProductBySlug(req, res, next) {
  try {
    await ensureSeeded()

    const { slug } = req.params
    const p = await Product.findOne({ slug })
    if (!p) {
      res.status(404)
      throw new Error('Product not found')
    }

    res.json({
      id: p.productId,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating ?? null,
      vatRate: p.vatRate ?? null,
      stock: p.stock ?? null,
      description: p.description,
      bullets: p.bullets,
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
      images: Array.isArray(p.images) && p.images.length ? p.images : [p.image].filter(Boolean),
      image: p.image,
    })
  } catch (err) {
    next(err)
  }
}

async function createProduct(req, res, next) {
  try {
    const payload = { ...req.body }

    if (payload.vatRate === '' || payload.vatRate === undefined) payload.vatRate = null
    if (payload.stock === '' || payload.stock === undefined) payload.stock = null
    if (payload.rating === '' || payload.rating === undefined) payload.rating = null

    if (payload.vatRate !== null) {
      const raw = typeof payload.vatRate === 'string' ? payload.vatRate.replace('%', '').trim() : payload.vatRate
      const n = Number(raw)
      payload.vatRate = Number.isFinite(n) ? n : null
    }

    if (payload.stock !== null) {
      const n = Number(payload.stock)
      payload.stock = Number.isFinite(n) ? n : null
    }

    if (payload.rating !== null) {
      const n = Number(payload.rating)
      payload.rating = Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : null
    }

    if (Array.isArray(payload.specifications)) {
      payload.specifications = payload.specifications
        .map((row) => ({
          label: String(row?.label || '').trim(),
          value: String(row?.value || '').trim(),
        }))
        .filter((row) => row.label || row.value)
    }
    if (Array.isArray(payload.images)) payload.images = payload.images.filter(Boolean).slice(0, 5)
    if ((!payload.images || payload.images.length === 0) && payload.image) payload.images = [payload.image]
    if (!payload.image && Array.isArray(payload.images) && payload.images[0]) payload.image = payload.images[0]

    const product = await Product.create(payload)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const payload = { ...req.body }

    if (payload.vatRate === '' || payload.vatRate === undefined) payload.vatRate = null
    if (payload.stock === '' || payload.stock === undefined) payload.stock = null
    if (payload.rating === '' || payload.rating === undefined) payload.rating = null

    if (payload.vatRate !== null) {
      const raw = typeof payload.vatRate === 'string' ? payload.vatRate.replace('%', '').trim() : payload.vatRate
      const n = Number(raw)
      payload.vatRate = Number.isFinite(n) ? n : null
    }

    if (payload.stock !== null) {
      const n = Number(payload.stock)
      payload.stock = Number.isFinite(n) ? n : null
    }

    if (payload.rating !== null) {
      const n = Number(payload.rating)
      payload.rating = Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : null
    }

    if (Array.isArray(payload.specifications)) {
      payload.specifications = payload.specifications
        .map((row) => ({
          label: String(row?.label || '').trim(),
          value: String(row?.value || '').trim(),
        }))
        .filter((row) => row.label || row.value)
    }
    if (Array.isArray(payload.images)) payload.images = payload.images.filter(Boolean).slice(0, 5)
    if ((!payload.images || payload.images.length === 0) && payload.image) payload.images = [payload.image]
    if (!payload.image && Array.isArray(payload.images) && payload.images[0]) payload.image = payload.images[0]

    const updated = await Product.findByIdAndUpdate(req.params.id, payload, { new: true })
    if (!updated) {
      res.status(404)
      throw new Error('Product not found')
    }
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404)
      throw new Error('Product not found')
    }
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}

async function listProductsAdmin(req, res, next) {
  try {
    await ensureSeeded()
    const items = await Product.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductsAdmin,
}
