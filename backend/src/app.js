const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const contactRoutes = require('./routes/contactRoutes')
const consultationRoutes = require('./routes/consultationRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend running...')
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
