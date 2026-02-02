const express = require('express')

const {
  stripeCheckout,
  stripeCreatePaymentIntent,
  razorpayCreateOrder,
  razorpayVerify,
  paytmInitiate,
  paytmCallback,
  paypalConfig,
  paypalCreateOrder,
  paypalCaptureOrder,
} = require('../controllers/paymentController')

const router = express.Router()

router.post('/stripe', stripeCheckout)
router.post('/stripe/intent', stripeCreatePaymentIntent)

router.post('/razorpay', razorpayCreateOrder)
router.post('/razorpay/verify', razorpayVerify)

router.post('/paytm', paytmInitiate)
router.post(
  '/paytm/callback',
  express.urlencoded({ extended: false }),
  express.json({ type: '*/*' }),
  paytmCallback,
)

router.get('/paypal/config', paypalConfig)
router.post('/paypal/create-order', paypalCreateOrder)
router.post('/paypal/capture-order', paypalCaptureOrder)

module.exports = router
