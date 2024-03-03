const request = require('supertest')
const { db } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /auth/register', () => {
	describe('Schema validation', () => {
		it('should validate email format correctly', async function() {
			const res = await request(global.app).post('/auth/register').send({
				username: 'test',
				email: 'test',
				password: 'password'
			})
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must match format "email"')
			expect(res.body.result[0].params.format).toBe('email')
		})
	})
	describe('Logic', () => {
		it('should create a new User and VerifyEmailToken', async function() {
			const res = await request(global.app).post('/auth/register').send({
				username: 'test',
				email: 'test@email.com',
				password: 'password'
			})
			expect(res.status).toBe(201)
			expect(res.body.message).toBe('User registered successfully')
			const user = await global.dbConnection.models.user.findOne({ username: 'test' })
			expect(user).toBeDefined()
			const verifyEmailToken = await global.dbConnection.models.verifyEmailToken.findOne({ owner: user._id })
			expect(verifyEmailToken).toBeDefined()
			expect(verifyEmailToken.token).toMatch(/^\d{6}$/)
		})

		it('usernames should be unique', async function() {
			await db.createDummyUser({
				email: 'test1@email.com'
			})
			const res = await request(global.app).post('/auth/register').send({
				username: 'test',
				email: 'test@email.com',
				password: 'password'
			})
			expect(res.status).toBe(409)
		})

		it('emails should be unique', async function() {
			await db.createDummyUser({
				username: 'test1'
			})
			const res = await request(global.app).post('/auth/register').send({
				username: 'test',
				email: 'test@email.com',
				password: 'password'
			})
			expect(res.status).toBe(409)
		})
	})
})
