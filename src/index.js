const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const { strategy } = require('./middlewares/passport-config')
const reqLogger = require('./middlewares/reqLogger')
const { noPathHandler, errorHandler } = require('./middlewares/errors')
const { server, mongo } = require('./config')

const app = express()
passport.use(strategy)

mongoose.connect(mongo.uri, {
	ssl: false
})
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))
if (process.env.NODE_ENV === 'local') {
	mongoose.connection.once('open', () => {
		console.log('Connected to MongoDB')
	})
}

app.use(express.json())
app.use(reqLogger)

app.get('/', (_req, res) => {
	res.send('jou ma se poes!')
})

const router = require('express').Router()
require('./routes/routes').attachRoutes(router)
app.use(router)
app.use(noPathHandler)
app.use(errorHandler)

const httpServer = app.listen(server.port, () => {
	if (process.env.NODE_ENV === 'local') console.log(`Server is running at http://localhost:${server.port}`)
})

module.exports = {
	app,
	httpServer,
	dbConnection: mongoose.connection
}