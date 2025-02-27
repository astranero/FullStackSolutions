const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const { blogRouter } = require('./controllers/blogs')
const { MONGODB_URI } = require('./utils/config')
const { loginRouter } = require('./controllers/login')
const { usersRouter } = require('./controllers/users')
const { testingRouter } = require('./controllers/testing');

const helper = require('./utils/helper')

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())


app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(helper.extractToken)
app.use(helper.extractUser)

app.use('/api/blogs', blogRouter)
if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter);
}

module.exports = { app };
