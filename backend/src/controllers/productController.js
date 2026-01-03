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
      description: p.description,
      bullets: p.bullets,
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
      description: p.description,
      bullets: p.bullets,
      image: p.image,
    })
  } catch (err) {
    next(err)
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
