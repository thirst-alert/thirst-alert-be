const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
	res.send('hallo')
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})