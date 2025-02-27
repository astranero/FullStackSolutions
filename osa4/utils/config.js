
require('dotenv').config()

const username = process.env.MONGO_USERNAME
const password = process.argv[2] || process.env.MONGO_PASSWORD

const PORT = process.env.PORT
const MONGODB_URI =  `mongodb+srv://${username}:${password}@${process.env.MONGO_CLUSTER}`
const SECRET = process.env.SECRET

module.exports = { PORT, MONGODB_URI, SECRET };
