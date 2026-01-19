const mongoose = require('mongoose')

const specificationSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    vatRate: { type: Number, default: null },
    stock: { type: Number, default: null },
    description: { type: String, required: true },
    bullets: { type: [String], default: [] },
    specifications: { type: [specificationSchema], default: [] },
    images: { type: [String], default: [] },
    image: { type: String, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Product', productSchema)
