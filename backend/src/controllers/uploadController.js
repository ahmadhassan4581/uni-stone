const cloudinary = require('cloudinary').v2

function ensureCloudinaryConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    const err = new Error('Cloudinary credentials are not configured')
    err.statusCode = 500
    throw err
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })
}

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })

    stream.end(buffer)
  })
}

async function uploadSingleImage(req, res, next) {
  try {
    ensureCloudinaryConfigured()

    if (!req.file) {
      res.status(400)
      throw new Error('No image uploaded')
    }

    const folder = process.env.CLOUDINARY_FOLDER || 'uni-stone'

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder,
      resource_type: 'image',
    })

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (err) {
    next(err)
  }
}

async function uploadMultipleImages(req, res, next) {
  try {
    ensureCloudinaryConfigured()

    const files = Array.isArray(req.files) ? req.files : []
    if (!files.length) {
      res.status(400)
      throw new Error('No images uploaded')
    }

    const folder = process.env.CLOUDINARY_FOLDER || 'uni-stone'

    const results = []
    for (const file of files.slice(0, 5)) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        folder,
        resource_type: 'image',
      })
      results.push({ url: result.secure_url, publicId: result.public_id })
    }

    res.json({ images: results })
  } catch (err) {
    next(err)
  }
}

module.exports = { uploadSingleImage, uploadMultipleImages }
