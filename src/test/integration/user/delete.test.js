const request = require('supertest')
const { db, authenticatedAgent } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('DELETE /user', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).delete('/user')
			expect(res.status).toBe(401)
		})
	})
	// describe('Schema validation', () => {

	// })
	describe('Logic', () => {
		it('should delete user and any data associated with it', async function() {
			const newUser = await db.createDummyUser()
			await db.createDummyRefreshToken(newUser._id)
			const res = await authenticatedAgent(newUser).delete('/user')
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('User deleted successfully')
			const user = await global.dbConnection.models.user.findOne({ _id: newUser._id })
			expect(user).toBeNull()
			const refreshToken = await global.dbConnection.models.refreshToken.findOne({ owner: newUser._id })
			expect(refreshToken).toBeNull()
		})
	})
})