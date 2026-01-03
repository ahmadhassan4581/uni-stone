const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./src/config/db')
const app = require('./src/app')
const ensureAdminUser = require('./src/utils/ensureAdminUser')

const PORT = Number(process.env.PORT) || 5000

connectDB()
  .then(() => {
    return ensureAdminUser()
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  })
