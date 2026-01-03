const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is not set')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri)
  console.log('MongoDB Connected')

  // Clean up legacy indexes from previous schemas (e.g. username unique index)
  try {
    const users = mongoose.connection.db.collection('users')
    const indexes = await users.indexes()
    const hasUsernameIndex = indexes.some((idx) => idx?.name === 'username_1')
    if (hasUsernameIndex) {
      await users.dropIndex('username_1')
      console.log('Dropped legacy index: users.username_1')
    }
  } catch (err) {
    // Ignore if collection/index doesn't exist or user lacks permissions
  }
}

module.exports = connectDB
