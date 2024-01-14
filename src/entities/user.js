const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'user' })

module.exports = mongoose.model('user', userSchema) 