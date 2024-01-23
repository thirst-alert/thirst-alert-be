require('dotenv').config()

module.exports = {
	server: {
		port: process.env.PORT || 3000,
	},
	mongo: {
		uri: process.env.NODE_ENV === 'local'
			? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017/${process.env.MONGO_DB}`
			: process.env.MONGO_URI,
	}
}