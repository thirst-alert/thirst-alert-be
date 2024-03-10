const request = require('supertest')
const { db, authenticatedAgent } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /sensor', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).post('/sensor')
			expect(res.status).toBe(401)
		})
	})

	describe('Schema validation', () => {
		it('should validate name correctly', async function() {
			const user = await db.createDummyUser()
			const res1 = await authenticatedAgent(user).post('/sensor').send({
				name: ''
			})
			expect(res1.status).toBe(422)
			expect(res1.body.result[0].message).toBe('must NOT have fewer than 1 characters')
			const res2 = await authenticatedAgent(user).post('/sensor').send({
				name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
			})
			expect(res2.status).toBe(422)
			expect(res2.body.result[0].message).toBe('must NOT have more than 32 characters')
		})
	})

	describe('Logic', () => {
		it('should create a sensor with authenticated user as its owner', async function() {
			const user = await db.createDummyUser()
			const res = await authenticatedAgent(user).post('/sensor').send({
				name: 'test'
			})
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Sensor created successfully')
			expect(res.body.sensor.name).toBe('test')
			const sensor = await global.dbConnection.models.sensor.findOne({ name: 'test' })
			expect(sensor).toBeDefined()
			expect(sensor.owner.toString()).toBe(user._id.toString())
		})
	})
})