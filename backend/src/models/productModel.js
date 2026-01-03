const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    bullets: { type: [String], default: [] },
    image: { type: String, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Product', productSchema)
