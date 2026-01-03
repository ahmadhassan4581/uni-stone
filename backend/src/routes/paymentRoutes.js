const express = require('express')

const {
  stripeCheckout,
  razorpayCreateOrder,
  razorpayVerify,
  paytmInitiate,
  paytmCallback,
} = require('../controllers/paymentController')

const router = express.Router()

router.post('/stripe', stripeCheckout)

router.post('/razorpay', razorpayCreateOrder)
router.post('/razorpay/verify', razorpayVerify)

router.post('/paytm', paytmInitiate)
router.post(
  '/paytm/callback',
  express.urlencoded({ extended: false }),
  express.json({ type: '*/*' }),
  paytmCallback,
)

module.exports = router
