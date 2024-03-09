const request = require('supertest')
const { db, authenticatedAgent } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('GET /me', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).get('/me')
			expect(res.status).toBe(401)
		})
	})
	// describe('Schema validation', () => {

	// })
	describe('Logic', () => {
		it('should return logged in user', async function() {
			const newUser = await db.createDummyUser()
			const res = await authenticatedAgent(newUser).get('/me')
			expect(res.status).toBe(200)
			expect(res.body).toStrictEqual({
				username: newUser.username,
				email: newUser.email,
				id: newUser._id.toString()
			})
		})
	})
})