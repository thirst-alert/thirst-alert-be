const express = require('express')
const routes = require('./routes/router')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.send('hallo')
})

app.use(routes)

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})