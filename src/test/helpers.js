const jwt = require('jsonwebtoken')
const { agent } = require('supertest')

module.exports = {
	db: {
		dropCollections: () => global.dbConnection.db.dropDatabase(),
		createDummyUser: (overrides = {}) =>
			global.dbConnection.models.user.create({
				username: 'test',
				email: 'test@email.com',
				password: 'password',
				...overrides
			}),
		createDummyVerifyEmailToken: (userId) => global.dbConnection.models.verifyEmailToken.create({
			token: '123456',
			owner: userId
		}),
		createDummyRefreshToken: (userId, overrides = {}) => global.dbConnection.models.refreshToken.create({
			token: '981d5edda9ec1c81d8f497e8a99b96864df9279529900eb67e951ece563b7b2dc4954295df4749ac983de9390368a7498f4e1ccdb5ef0cbfffc8206ac99870c4',
			owner: userId,
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			...overrides
		})
	},
	authenticatedAgent: (user) => {
		const token = jwt.sign(
			user.toJWTPayload(),
			process.env.JWT_SECRET,
			{
				expiresIn: '1h',
			}
		)
		const authAgent = agent(global.app)
		return authAgent.auth(token, { type: 'bearer' })
	}
}