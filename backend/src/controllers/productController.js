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
      saleEnabled: Boolean(p.saleEnabled),
      salePrice: p.salePrice ?? null,
      rating: p.rating ?? null,
      numReviews: p.numReviews ?? 0,
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
      saleEnabled: Boolean(p.saleEnabled),
      salePrice: p.salePrice ?? null,
      rating: p.rating ?? null,
      numReviews: p.numReviews ?? 0,
      reviews: Array.isArray(p.reviews)
        ? p.reviews
            .map((r) => ({
              _id: r._id,
              user: r.user,
              name: r.name,
              rating: r.rating,
              comment: r.comment,
              createdAt: r.createdAt,
            }))
            .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        : [],
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

async function addReview(req, res, next) {
  try {
    await ensureSeeded()

    const { slug } = req.params
    const product = await Product.findOne({ slug })
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    const rating = Number(req.body?.rating)
    const comment = String(req.body?.comment || '').trim()
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      res.status(400)
      throw new Error('Rating must be between 1 and 5')
    }

    const userId = String(req.user?._id || '')
    if (!userId) {
      res.status(401)
      throw new Error('Not authorized')
    }

    const alreadyReviewed = Array.isArray(product.reviews)
      ? product.reviews.some((r) => String(r.user) === userId)
      : false

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('You have already reviewed this product')
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    })

    product.numReviews = Array.isArray(product.reviews) ? product.reviews.length : 0
    const avg = product.numReviews
      ? product.reviews.reduce((sum, r) => sum + Number(r?.rating || 0), 0) / product.numReviews
      : 0
    product.rating = Number.isFinite(avg) ? Math.round(avg * 10) / 10 : null

    await product.save()

    res.status(201).json({
      id: product.productId,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating ?? null,
      numReviews: product.numReviews ?? 0,
      reviews: Array.isArray(product.reviews)
        ? product.reviews
            .map((r) => ({
              _id: r._id,
              user: r.user,
              name: r.name,
              rating: r.rating,
              comment: r.comment,
              createdAt: r.createdAt,
            }))
            .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        : [],
      vatRate: product.vatRate ?? null,
      stock: product.stock ?? null,
      description: product.description,
      bullets: product.bullets,
      specifications: Array.isArray(product.specifications) ? product.specifications : [],
      images:
        Array.isArray(product.images) && product.images.length ? product.images : [product.image].filter(Boolean),
      image: product.image,
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
    if (payload.salePrice === '' || payload.salePrice === undefined) payload.salePrice = null

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

    payload.saleEnabled = Boolean(payload.saleEnabled)
    if (payload.salePrice !== null) {
      const n = Number(payload.salePrice)
      payload.salePrice = Number.isFinite(n) ? n : null
    }
    if (payload.saleEnabled && (payload.salePrice === null || payload.salePrice <= 0)) {
      res.status(400)
      throw new Error('Sale price is required when sale is enabled')
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
    if (payload.salePrice === '' || payload.salePrice === undefined) payload.salePrice = null

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

    payload.saleEnabled = Boolean(payload.saleEnabled)
    if (payload.salePrice !== null) {
      const n = Number(payload.salePrice)
      payload.salePrice = Number.isFinite(n) ? n : null
    }
    if (payload.saleEnabled && (payload.salePrice === null || payload.salePrice <= 0)) {
      res.status(400)
      throw new Error('Sale price is required when sale is enabled')
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

async function listAllReviewsAdmin(req, res, next) {
  try {
    await ensureSeeded()

    const products = await Product.find(
      { 'reviews.0': { $exists: true } },
      { productId: 1, slug: 1, name: 1, reviews: 1 },
    ).lean()

    const rows = []
    for (const p of products) {
      const reviews = Array.isArray(p?.reviews) ? p.reviews : []
      for (const r of reviews) {
        rows.push({
          _id: r?._id,
          productId: p?.productId,
          productSlug: p?.slug,
          productName: p?.name,
          user: r?.user,
          name: r?.name,
          rating: r?.rating,
          comment: r?.comment,
          createdAt: r?.createdAt,
        })
      }
    }

    rows.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

async function updateReviewAdmin(req, res, next) {
  try {
    const { slug, reviewId } = req.params
    const product = await Product.findOne({ slug })
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    const review = product.reviews.id(reviewId)
    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    const nextRatingRaw = req.body?.rating
    if (nextRatingRaw !== undefined) {
      const nextRating = Number(nextRatingRaw)
      if (!Number.isFinite(nextRating) || nextRating < 1 || nextRating > 5) {
        res.status(400)
        throw new Error('Rating must be between 1 and 5')
      }
      review.rating = nextRating
    }

    if (req.body?.comment !== undefined) {
      review.comment = String(req.body?.comment || '').trim()
    }

    product.numReviews = Array.isArray(product.reviews) ? product.reviews.length : 0
    const avg = product.numReviews
      ? product.reviews.reduce((sum, r) => sum + Number(r?.rating || 0), 0) / product.numReviews
      : 0
    product.rating = Number.isFinite(avg) ? Math.round(avg * 10) / 10 : null

    await product.save()

    res.json({
      _id: review._id,
      user: review.user,
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      product: {
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        rating: product.rating ?? null,
        numReviews: product.numReviews ?? 0,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function deleteReviewAdmin(req, res, next) {
  try {
    const { slug, reviewId } = req.params
    const product = await Product.findOne({ slug })
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    const review = product.reviews.id(reviewId)
    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    review.deleteOne()

    product.numReviews = Array.isArray(product.reviews) ? product.reviews.length : 0
    const avg = product.numReviews
      ? product.reviews.reduce((sum, r) => sum + Number(r?.rating || 0), 0) / product.numReviews
      : 0
    product.rating = Number.isFinite(avg) ? Math.round(avg * 10) / 10 : null

    await product.save()

    res.json({
      message: 'Deleted',
      product: {
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        rating: product.rating ?? null,
        numReviews: product.numReviews ?? 0,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listProducts,
  getProductBySlug,
  addReview,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductsAdmin,
  listAllReviewsAdmin,
  updateReviewAdmin,
  deleteReviewAdmin,
}
