const mailer = require('nodemailer')

require('dotenv').config()

module.exports = {
	server: {
		baseUrl: process.env.BASE_URL,
		port: process.env.PORT || 3000,
	},
	mongo: {
		uri: process.env.NODE_ENV === 'local'
			? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017/${process.env.MONGO_DB}`
			: process.env.MONGO_URI,
	},
	mailer: mailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: 'noreply@thirst-alert.com',
			clientId: process.env.MAILER_CLIENT_ID,
			clientSecret: process.env.MAILER_CLIENT_SECRET,
			refreshToken: process.env.MAILER_REFRESH_TOKEN,
			accessToken: process.env.MAILER_ACCESS_TOKEN
		},
	})
}