const request = require('supertest')
const { db } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /user/reset-password', () => {
	describe('Schema validation', () => {
		it('should validate email format correctly', async function() {
			const res = await request(global.app).post('/user/reset-password').send({
				email: 'test'
			})
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must match format "email"')
			expect(res.body.result[0].params.format).toBe('email')
		})
	})

	describe('Logic', () => {
		it('should create a resetPasswordToken tied to the user', async function() {
			const user = await db.createDummyUser()
			const res = await request(global.app).post('/user/reset-password').send({
				email: user.email
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('An email with reset instructions has been sent to the given account if it exists')
			const resetPasswordToken = await global.dbConnection.models.resetPasswordToken.findOne({ owner: user._id })
			expect(resetPasswordToken).toBeDefined()
		})

		it('should return the same response if the user does not exist', async function() {
			const res = await request(global.app).post('/user/reset-password').send({
				email: 'test@email.com'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('An email with reset instructions has been sent to the given account if it exists')
			const resetPasswordTokens = await global.dbConnection.models.resetPasswordToken.find()
			expect(resetPasswordTokens).toHaveLength(0)
		})
	})
})

describe('GET /user/reset-password', () => {
	// describe('Schema validation', () => {
	// })

	describe('Logic', () => {
		it('should render the password reset form if token is valid', async function() {
			const user = await db.createDummyUser()
			const resetPasswordToken = await db.createDummyResetPasswordToken(user._id)
			const res = await request(global.app).get('/user/reset-password').query({
				token: resetPasswordToken.token,
				userId: user._id.toString()
			})
			expect(res.status).toBe(200)
			expect(res.text).toContain('<h1>Password Reset</h1>')
		})

		it('should render an invalid template if token is expired', async function() {
			const user = await db.createDummyUser()
			const res = await request(global.app).get('/user/reset-password').query({
				token: '2faeca1d5cd6ce359f6db0270b50006e20ac413541c8cebaaa9c1d090581a00c20320b215986f6e74ffbf0dab4437c7663fe3e203d54b0456e6a02cb316c0568',
				userId: user._id.toString()
			})
			expect(res.status).toBe(200)
			expect(res.text).toContain('<p>Token is invalid or expired. Please try resetting your password again.</p>')
		})

		it('should render an invalid template if token is not tied to user', async function() {
			const user1 = await db.createDummyUser({
				username: 'test1',
				email: 'test1@email.com',
			})
			const user2 = await db.createDummyUser({
				username: 'test2',
				email: 'test2@email.com',
			})
			const resetPasswordToken = await db.createDummyResetPasswordToken(user1._id)
			const res = await request(global.app).get('/user/reset-password').query({
				token: resetPasswordToken.token,
				userId: user2._id.toString()
			})
			expect(res.status).toBe(200)
			expect(res.text).toContain('<p>Token is invalid or expired. Please try resetting your password again.</p>')
		})
	})
})

describe('PATCH /user/reset-password', () => {
	// describe('Schema validation', () => {
	// })

	describe('Logic', () => {
		it('should reset the users password and delete the resetPasswordToken', async function() {
			const user = await db.createDummyUser()
			const resetPasswordToken = await db.createDummyResetPasswordToken(user._id)
			const res = await request(global.app).patch('/user/reset-password').send({
				token: resetPasswordToken.token,
				userId: user._id.toString(),
				password: 'newpassword'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Password reset successfully')
			const updatedUser = await global.dbConnection.models.user.findById(user._id)
			expect(updatedUser.comparePassword('newpassword')).toBe(true)
			const resetPasswordTokens = await global.dbConnection.models.resetPasswordToken.find()
			expect(resetPasswordTokens).toHaveLength(0)
		})

		it('should error if the resetPasswordToken is expired', async function() {
			const user = await db.createDummyUser()
			const res = await request(global.app).patch('/user/reset-password').send({
				token: '2faeca1d5cd6ce359f6db0270b50006e20ac413541c8cebaaa9c1d090581a00c20320b215986f6e74ffbf0dab4437c7663fe3e203d54b0456e6a02cb316c0568',
				userId: user._id.toString(),
				password: 'newpassword'
			})
			expect(res.status).toBe(403)
			expect(res.body.error.message).toBe('Invalid reset token')
		})

		it('should error if the resetPasswordToken is not tied to user', async function() {
			const user1 = await db.createDummyUser({
				username: 'test1',
				email: 'test1@email.com'
			})
			const user2 = await db.createDummyUser({
				username: 'test2',
				email: 'test2@email.com'
			})
			const resetPasswordToken = await db.createDummyResetPasswordToken(user1._id)
			const res = await request(global.app).patch('/user/reset-password').send({
				token: resetPasswordToken.token,
				userId: user2._id.toString(),
				password: 'newpassword'
			})
			expect(res.status).toBe(403)
			expect(res.body.error.message).toBe('Invalid reset token')
		})
	})
})