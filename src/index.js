const express = require('express')
const mongoose = require('mongoose')
// const routes = require('./routes/router')
const reqLogger = require('./middlewares/reqLogger')
const { noPathHandler, errorHandler } = require('./middlewares/errors')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017/${process.env.MONGO_DB}`)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
})

app.use(express.json())
app.use(reqLogger)

app.get('/', (_req, res) => {
	res.send('hallo')
})

// app.use(routes)
const router = require('express').Router()
require('./routes/routes').attachRoutes(router)
app.use(router)
app.use(noPathHandler)
app.use(errorHandler)

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})