const request = require('supertest')
const { db } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /auth/login', () => {
	// describe('Schema validation', () => {
	// })
	describe('Logic', () => {
		it('should create a RefreshToken and return token, refresh token, and user', async function() {
			const newUser = await db.createDummyUser({
				active: true
			})
			const res = await request(global.app).post('/auth/login').send({
				identity: newUser.username,
				password: 'password'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Logged in successfully')
			expect(res.body.token).toBeDefined()
			expect(res.body.refreshToken).toBeDefined()
			expect(res.body.user).toBeDefined()
			expect(res.body.user).toStrictEqual({
				username: newUser.username,
				email: newUser.email,
				id: newUser._id.toString()
			})
			expect(JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64').toString('ascii')).username).toBe(newUser.username)
			const refreshToken = await global.dbConnection.models.refreshToken.findOne({ owner: newUser._id })
			expect(refreshToken).toBeDefined()
			expect(refreshToken.token).toBe(res.body.refreshToken)
		})

		it('should also work with email', async function() {
			const newUser = await db.createDummyUser({
				active: true
			})
			const res = await request(global.app).post('/auth/login').send({
				identity: newUser.email,
				password: 'password'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Logged in successfully')
			expect(res.body.token).toBeDefined()
			expect(res.body.refreshToken).toBeDefined()
			expect(res.body.user).toBeDefined()
			expect(res.body.user).toStrictEqual({
				username: newUser.username,
				email: newUser.email,
				id: newUser._id.toString()
			})
			expect(JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64').toString('ascii')).username).toBe(newUser.username)
			const refreshToken = await global.dbConnection.models.refreshToken.findOne({ owner: newUser._id })
			expect(refreshToken).toBeDefined()
			expect(refreshToken.token).toBe(res.body.refreshToken)
		})

		it('should not allow unverified users to login', async function() {
			const newUser = await db.createDummyUser()
			const res = await request(global.app).post('/auth/login').send({
				identity: newUser.username,
				password: 'password'
			})
			expect(res.status).toBe(403)
			expect(res.body.error.message).toBe('Email not verified')
		})

		it('should error if user doesnt exist', async function() {
			const res = await request(global.app).post('/auth/login').send({
				identity: 'test',
				password: 'password'
			})
			expect(res.status).toBe(404)
			expect(res.body.error.message).toBe('Invalid username/email or password')
		})

		it('should error if password is incorrect', async function() {
			const newUser = await db.createDummyUser({
				active: true
			})
			const res = await request(global.app).post('/auth/login').send({
				identity: newUser.username,
				password: 'password1'
			})
			expect(res.status).toBe(404)
			expect(res.body.error.message).toBe('Invalid username/email or password')
		})
	})
})