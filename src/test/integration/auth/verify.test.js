const request = require('supertest')
const { db } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /auth/verify', () => {
	// describe('Schema validation', () => {
		
	// })
	describe('Logic', () => {
		it('should activate User and delete VerifyEmailToken', async function() {
			const newUser = await db.createDummyUser()
			expect(newUser.active).toBe(false)
			await db.createDummyVerifyEmailToken(newUser._id)
			const res = await request(global.app).post('/auth/verify').send({
				identity: 'test@email.com',
				token: '123456'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Email verified successfully')
			const user = await global.dbConnection.models.user.findOne({ username: 'test' })
			expect(user.active).toBe(true)
			const verifyEmailToken = await global.dbConnection.models.verifyEmailToken.findOne({ owner: user._id })
			expect(verifyEmailToken).toBeNull()
		})

		it('should also work with userName', async function () {
			const newUser = await db.createDummyUser()
			expect(newUser.active).toBe(false)
			await db.createDummyVerifyEmailToken(newUser._id)
			const res = await request(global.app).post('/auth/verify').send({
				identity: 'test',
				token: '123456',
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Email verified successfully')
			const user = await global.dbConnection.models.user.findOne({
				username: 'test',
			})
			expect(user.active).toBe(true)
			const verifyEmailToken =
				await global.dbConnection.models.verifyEmailToken.findOne({
					owner: user._id,
				})
			expect(verifyEmailToken).toBeNull()
		})

		it('should error if token doesnt exist', async function() {
			const res = await request(global.app).post('/auth/verify').send({
				identity: 'test@email.com',
				token: '123456'
			})
			expect(res.status).toBe(400)
			expect(res.body.error.message).toBe('Invalid token')
		})

		it('should error if token is not associated with email', async function() {
			const user1 = await db.createDummyUser()
			const user2 = await db.createDummyUser({
				username: 'test1',
				email: 'test1@email.com'
			})
			const token = await db.createDummyVerifyEmailToken(user1._id)
			const res = await request(global.app).post('/auth/verify').send({
				identity: user2.email,
				token: token.token
			})
			expect(res.status).toBe(400)
			expect(res.body.error.message).toBe('Invalid token')
		})
	})
})