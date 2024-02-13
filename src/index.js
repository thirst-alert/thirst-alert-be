const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
// const routes = require('./routes/router')
const reqLogger = require('./middlewares/reqLogger')
const { noPathHandler, errorHandler } = require('./middlewares/errors')
const { server, mongo } = require('./config')

const app = express()

mongoose.connect(mongo.uri, {
	ssl: false
})
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
})

app.use(express.json())
app.use(reqLogger)
app.use(passport.initialize())
require('./middlewares/passport-config')(passport)

app.get('/', (_req, res) => {
	res.send('jou ma se poes!')
})

const router = require('express').Router()
require('./routes/routes').attachRoutes(router)
app.use(router)
app.use(noPathHandler)
app.use(errorHandler)

app.listen(server.port, () => {
	console.log(`Server is running at http://localhost:${server.port}`)
})