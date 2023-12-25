const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  id: Number,
  text: String,
  done: Boolean
})

module.exports = mongoose.model('Todo', todoSchema)
