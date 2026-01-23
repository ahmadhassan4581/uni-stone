const nodemailer = require('nodemailer')

let cachedTransporter = null

function getMailerConfig() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user
  const customerFrom = process.env.SMTP_CUSTOMER_FROM || from

  return {
    host,
    port: port ? Number(port) : null,
    user,
    pass,
    from,
    customerFrom,
  }
}

function isConfigured() {
  const cfg = getMailerConfig()
  return Boolean(cfg.host && cfg.port && cfg.user && cfg.pass && cfg.from)
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter
  if (!isConfigured()) return null

  const cfg = getMailerConfig()
  cachedTransporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  })

  return cachedTransporter
}

async function sendMailIfConfigured({ to, subject, text, from, cc, bcc }) {
  const transporter = getTransporter()
  if (!transporter) return false

  const cfg = getMailerConfig()
  if (!to || !subject || !text) return false

  await transporter.sendMail({
    from: from || cfg.from,
    to,
    cc,
    bcc,
    subject,
    text,
  })

  return true
}

async function sendCustomerMailIfConfigured({ to, subject, text }) {
  const cfg = getMailerConfig()
  return sendMailIfConfigured({ to, subject, text, from: cfg.customerFrom })
}

module.exports = {
  getMailerConfig,
  isConfigured,
  sendMailIfConfigured,
  sendCustomerMailIfConfigured,
}
