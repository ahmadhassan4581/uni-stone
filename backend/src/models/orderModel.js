const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false },
)

const orderAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    company: { type: String, default: '' },
    address1: { type: String, default: '' },
    town: { type: String, default: '' },
    county: { type: String, default: '' },
    postcode: { type: String, default: '' },
    telephone: { type: String, default: '' },
  },
  { _id: false },
)

const orderDeliveryDetailsSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    company: { type: String, default: '' },
    address1: { type: String, default: '' },
    town: { type: String, default: '' },
    county: { type: String, default: '' },
    postcode: { type: String, default: '' },
    telephone: { type: String, default: '' },
    billingSame: { type: Boolean, default: true },
    billing: { type: orderAddressSchema, default: null },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: { type: [orderItemSchema], default: [] },
    currency: { type: String, default: 'USD' },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['created', 'paid', 'shipped', 'completed', 'cancelled'], default: 'created' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['card', 'telephone', 'unknown'], default: 'unknown' },
    paymentReference: { type: String, default: '' },
    deliveryDetails: { type: orderDeliveryDetailsSchema, default: null },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Order', orderSchema)
