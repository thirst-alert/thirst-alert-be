const request = require('supertest')
const { db, authenticatedAgent } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('GET /sensor', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).get('/sensor')
			expect(res.status).toBe(401)
		})
	})

	describe('Logic', () => {
		it('should return all sensors for a user', async function() {
			const user = await db.createDummyUser()
			const sensor1 = await db.createDummySensor(user._id, {
				name: 'test1'
			})
			const sensor2 = await db.createDummySensor(user._id, {
				name: 'test2'
			})
			const res = await authenticatedAgent(user).get('/sensor')
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Sensors fetched successfully')
			expect(res.body.sensors.length).toBe(2)
			expect(res.body.sensors.find(sensor => sensor.name === sensor1.name)).toBeDefined()
			expect(res.body.sensors.find(sensor => sensor.name === sensor2.name)).toBeDefined()
		})
	})
})

describe('GET /sensor/:sensorId', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).get('/sensor/65ecd6fbc66268658ae1fd09')
			expect(res.status).toBe(401)
		})
	})

	describe('Schema validation', () => {
		it('should validate sensorId correctly', async function() {
			const user = await db.createDummyUser()
			const res = await authenticatedAgent(user).get('/sensor/123')
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must match pattern "^[0-9a-fA-F]{24}$"')
		})
	})

	describe('Logic', () => {
		it('should return a sensor', async function() {
			const user = await db.createDummyUser()
			const sensor = await db.createDummySensor(user._id)
			const res = await authenticatedAgent(user).get(`/sensor/${sensor._id}`)
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Sensor fetched successfully')
			expect(res.body.sensor.id).toBe(sensor._id.toString())
		})

		it('should error if sensor does not exist', async function() {
			const user = await db.createDummyUser()
			const res = await authenticatedAgent(user).get('/sensor/65ecd6fbc66268658ae1fd09')
			expect(res.status).toBe(404)
			expect(res.body.error.message).toBe('Sensor not found')
		})

		it('should error if sensor does not belong to user', async function() {
			const user1 = await db.createDummyUser({
				username: 'test1',
				email: 'test1@email.com'
			})
			const user2 = await db.createDummyUser({
				username: 'test2',
				email: 'test2@email.com'
			})
			const sensor = await db.createDummySensor(user1._id)
			const res = await authenticatedAgent(user2).get(`/sensor/${sensor._id}`)
			expect(res.status).toBe(404)
			expect(res.body.error.message).toBe('Sensor not found')
		})
	})
})