const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const { blogRouter } = require('./controllers/blogs')
const { MONGODB_URI } = require('./utils/config')
const { loginRouter } = require('./controllers/login')
const { usersRouter } = require('./controllers/users')

const helper = require('./utils/helper')

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', helper.extractToken, helper.extractUser, blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = { app };
