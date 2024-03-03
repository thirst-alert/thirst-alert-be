const request = require('supertest')
const { db } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /auth/refresh', () => {
	// describe('Schema validation', () => {
	// })
	describe('Logic', () => {
		it('should generate a new valid access token', async function() {
			const newUser = await db.createDummyUser()
			const refreshToken = await db.createDummyRefreshToken(newUser._id)
			const res = await request(global.app).post('/auth/refresh').send({
				username: newUser.username,
				refreshToken: refreshToken.token
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('New access token generated')
			expect(res.body.token).toBeDefined()
			expect(JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64').toString('ascii')).username).toBe(newUser.username)
		})

		it('should error if token doesnt exist', async function() {
			const newUser = await db.createDummyUser()
			const res = await request(global.app).post('/auth/refresh').send({
				username: newUser.username,
				refreshToken: '981d5edda9ec1c81d8f497e8a99b96864df9279529900eb67e951ece563b7b2dc4954295df4749ac983de9390368a7498f4e1ccdb5ef0cbfffc8206ac99870c5'
			})
			expect(res.status).toBe(403)
			expect(res.body.error.message).toBe('Forbidden: Invalid refresh token')
		})

		it('should error if token is not associated with username', async function() {
			const user1 = await db.createDummyUser()
			const user2 = await db.createDummyUser({
				username: 'test1',
				email: 'test1@email.com'
			})
			const refreshToken = await db.createDummyRefreshToken(user1._id)
			const res = await request(global.app).post('/auth/refresh').send({
				username: user2.username,
				refreshToken: refreshToken.token
			})
			expect(res.status).toBe(403)
			expect(res.body.error.message).toBe('Forbidden: Invalid refresh token')
		})

		it('should error if token is expired', async function() {
			const newUser = await db.createDummyUser()
			const refreshToken = await db.createDummyRefreshToken(newUser._id, {
				expiresAt: new Date(Date.now() - 1)
			})
			const res = await request(global.app).post('/auth/refresh').send({
				username: newUser.username,
				refreshToken: refreshToken.token
			})
			expect(res.status).toBe(403)
			expect(res.body.error.message).toBe('Forbidden: Refresh token expired')
		})
	})
})