const crypto = require('crypto')
const https = require('https')

function httpError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

function requireEnv(keys) {
  const missing = keys.filter((k) => !process.env[k])
  if (missing.length) {
    throw httpError(400, `Missing required env: ${missing.join(', ')}`)
  }
}

function getFrontendBase(req) {
  return process.env.FRONTEND_URL || req.get('origin') || 'http://localhost:5173'
}

function getBackendBase(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol
  return process.env.BACKEND_URL || `${proto}://${req.get('host')}`
}

function normalizeAmount(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) throw httpError(400, 'Invalid amount')
  return n
}

function paypalHost() {
  const env = String(process.env.PAYPAL_ENV || 'SANDBOX').toUpperCase()
  return env === 'LIVE' ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com'
}

function httpsRequest({ host, path, method, headers, body }) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : ''
    const req = https.request(
      {
        host,
        path,
        method,
        headers: {
          ...(headers || {}),
          ...(body
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
              }
            : {}),
        },
      },
      (resp) => {
        let raw = ''
        resp.on('data', (chunk) => {
          raw += chunk
        })
        resp.on('end', () => {
          resolve({ statusCode: resp.statusCode || 0, raw })
        })
      },
    )

    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function paypalAccessToken() {
  requireEnv(['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'])

  const host = paypalHost()
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host,
        path: '/v1/oauth2/token',
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      (resp) => {
        let raw = ''
        resp.on('data', (c) => (raw += c))
        resp.on('end', () => {
          try {
            const data = JSON.parse(raw || '{}')
            if ((resp.statusCode || 0) >= 400) {
              reject(httpError(400, data?.error_description || 'PayPal auth failed'))
              return
            }
            if (!data?.access_token) {
              reject(httpError(400, 'PayPal auth failed'))
              return
            }
            resolve(String(data.access_token))
          } catch (e) {
            reject(e)
          }
        })
      },
    )

    req.on('error', reject)
    req.write('grant_type=client_credentials')
    req.end()
  })
}

async function paypalConfig(req, res, next) {
  try {
    requireEnv(['PAYPAL_CLIENT_ID'])
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID })
  } catch (err) {
    next(err)
  }
}

async function paypalCreateOrder(req, res, next) {
  try {
    const amount = normalizeAmount(req.body?.amount ?? req.body?.subtotal)
    const currency = String(req.body?.currency || 'GBP').toUpperCase()

    const accessToken = await paypalAccessToken()
    const host = paypalHost()

    const result = await httpsRequest({
      host,
      path: '/v2/checkout/orders',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
      },
    })

    const parsed = JSON.parse(result.raw || '{}')
    if (result.statusCode >= 400) {
      throw httpError(400, parsed?.message || parsed?.details?.[0]?.description || 'Unable to create PayPal order')
    }

    res.json({ id: parsed.id })
  } catch (err) {
    next(err)
  }
}

async function paypalCaptureOrder(req, res, next) {
  try {
    const orderId = String(req.body?.orderId || '').trim()
    if (!orderId) throw httpError(400, 'Missing orderId')

    const accessToken = await paypalAccessToken()
    const host = paypalHost()

    const result = await httpsRequest({
      host,
      path: `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const parsed = JSON.parse(result.raw || '{}')
    if (result.statusCode >= 400) {
      throw httpError(400, parsed?.message || parsed?.details?.[0]?.description || 'Unable to capture PayPal order')
    }

    res.json(parsed)
  } catch (err) {
    next(err)
  }
}

async function stripeCheckout(req, res, next) {
  try {
    requireEnv(['STRIPE_SECRET_KEY'])

    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const amount = normalizeAmount(req.body?.amount ?? req.body?.subtotal)
    const currency = (req.body?.currency || 'USD').toLowerCase()

    const frontend = getFrontendBase(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: req.body?.kind === 'consultation' ? req.body?.packageName || 'Consultation' : 'Order payment',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${frontend}/checkout?status=success&provider=stripe`,
      cancel_url: `${frontend}/checkout?status=cancel&provider=stripe`,
      metadata: {
        kind: req.body?.kind || 'cart',
        packageId: req.body?.packageId || '',
      },
    })

    res.json({ redirectUrl: session.url })
  } catch (err) {
    next(err)
  }
}

async function stripeCreatePaymentIntent(req, res, next) {
  try {
    requireEnv(['STRIPE_SECRET_KEY'])

    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const amount = normalizeAmount(req.body?.amount ?? req.body?.subtotal)
    const currency = (req.body?.currency || 'USD').toLowerCase()

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        kind: req.body?.kind || 'cart',
      },
    })

    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    next(err)
  }
}

async function razorpayCreateOrder(req, res, next) {
  try {
    requireEnv(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'])

    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const amount = normalizeAmount(req.body?.amount ?? req.body?.subtotal)
    const currency = (req.body?.currency || 'INR').toUpperCase()

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        kind: req.body?.kind || 'cart',
        packageId: req.body?.packageId || '',
      },
    })

    res.json({
      provider: 'razorpay',
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name: process.env.BUSINESS_NAME || 'Engineeringg',
      description: req.body?.kind === 'consultation' ? req.body?.packageName || 'Consultation' : 'Order payment',
    })
  } catch (err) {
    next(err)
  }
}

async function razorpayVerify(req, res, next) {
  try {
    requireEnv(['RAZORPAY_KEY_SECRET'])

    const orderId = req.body?.orderId
    const paymentId = req.body?.paymentId
    const signature = req.body?.signature

    if (!orderId || !paymentId || !signature) {
      throw httpError(400, 'Missing payment verification fields')
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (expected !== signature) {
      throw httpError(400, 'Invalid payment signature')
    }

    res.json({ verified: true })
  } catch (err) {
    next(err)
  }
}

function paytmHost() {
  const env = (process.env.PAYTM_ENV || 'STAGE').toUpperCase()
  return env === 'PROD' ? 'securegw.paytm.in' : 'securegw-stage.paytm.in'
}

function httpsJsonRequest({ host, path, method, body }) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : ''

    const req = https.request(
      {
        host,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (resp) => {
        let raw = ''
        resp.on('data', (chunk) => {
          raw += chunk
        })
        resp.on('end', () => {
          try {
            resolve(JSON.parse(raw || '{}'))
          } catch (e) {
            reject(e)
          }
        })
      },
    )

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function paytmInitiate(req, res, next) {
  try {
    requireEnv(['PAYTM_MID', 'PAYTM_MERCHANT_KEY'])

    const PaytmChecksum = require('paytmchecksum')

    const amount = normalizeAmount(req.body?.amount ?? req.body?.subtotal)
    const mid = process.env.PAYTM_MID
    const merchantKey = process.env.PAYTM_MERCHANT_KEY
    const websiteName = process.env.PAYTM_WEBSITE || 'DEFAULT'

    const orderId = `ORD${Date.now()}`
    const callbackUrl = `${getBackendBase(req)}/api/payments/paytm/callback`

    const body = {
      requestType: 'Payment',
      mid,
      websiteName,
      orderId,
      callbackUrl,
      txnAmount: {
        value: amount.toFixed(2),
        currency: (process.env.PAYTM_CURRENCY || 'INR').toUpperCase(),
      },
      userInfo: {
        custId: req.body?.userId || 'CUST_001',
      },
    }

    const signature = await PaytmChecksum.generateSignature(JSON.stringify(body), merchantKey)
    const request = { body, head: { signature } }

    const host = paytmHost()
    const result = await httpsJsonRequest({
      host,
      path: `/theia/api/v1/initiateTransaction?mid=${encodeURIComponent(mid)}&orderId=${encodeURIComponent(orderId)}`,
      method: 'POST',
      body: request,
    })

    const status = result?.body?.resultInfo?.resultStatus
    if (status !== 'S') {
      throw httpError(400, result?.body?.resultInfo?.resultMsg || 'Unable to initiate Paytm transaction')
    }

    const txnToken = result?.body?.txnToken
    const payUrl = `https://${host}/theia/api/v1/showPaymentPage?mid=${encodeURIComponent(mid)}&orderId=${encodeURIComponent(orderId)}`

    res.json({
      provider: 'paytm',
      payUrl,
      params: {
        mid,
        orderId,
        txnToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function paytmCallback(req, res, next) {
  try {
    requireEnv(['PAYTM_MERCHANT_KEY'])

    const PaytmChecksum = require('paytmchecksum')
    const merchantKey = process.env.PAYTM_MERCHANT_KEY

    const payload = { ...(req.body || {}) }
    const checksum = payload.CHECKSUMHASH
    delete payload.CHECKSUMHASH

    const ok = checksum ? PaytmChecksum.verifySignature(payload, merchantKey, checksum) : false

    const frontend = getFrontendBase(req)
    const status = payload.STATUS || payload.RESPCODE || ''

    if (!ok) {
      res.redirect(`${frontend}/checkout?status=failed&provider=paytm`)
      return
    }

    if (status === 'TXN_SUCCESS' || status === '01') {
      res.redirect(`${frontend}/checkout?status=success&provider=paytm`)
      return
    }

    res.redirect(`${frontend}/checkout?status=cancel&provider=paytm`)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  stripeCheckout,
  stripeCreatePaymentIntent,
  razorpayCreateOrder,
  razorpayVerify,
  paytmInitiate,
  paytmCallback,
  paypalConfig,
  paypalCreateOrder,
  paypalCaptureOrder,
}
