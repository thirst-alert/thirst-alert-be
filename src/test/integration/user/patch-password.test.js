const request = require('supertest')
const { db, authenticatedAgent } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('PATCH /user/patch-password', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).patch('/user/patch-password').send({
				oldPassword: 'password',
				newPassword: 'newPassword'
			})
			expect(res.status).toBe(401)
		})
	})
	// describe('Schema validation', () => {

	// })
	describe('Logic', () => {
		it('should patch a users password', async function() {
			const newUser = await db.createDummyUser()
			const res = await authenticatedAgent(newUser).patch('/user/patch-password').send({
				oldPassword: 'password',
				newPassword: 'newPassword'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Password updated successfully')
			const user = await global.dbConnection.models.user.findOne({ _id: newUser._id })
			expect(user.comparePassword('newPassword')).toBe(true)
		})
		it('should error if oldPassword is incorrect', async function() {
			const newUser = await db.createDummyUser()
			const res = await authenticatedAgent(newUser).patch('/user/patch-password').send({
				oldPassword: 'password1',
				newPassword: 'newPassword'
			})
			expect(res.status).toBe(400)
			expect(res.body.error.message).toBe('Invalid password')
		})
	})
})