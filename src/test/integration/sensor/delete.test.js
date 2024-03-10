const request = require('supertest')
const { db, authenticatedAgent } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('DELETE /sensor/:sensorId', () => {
	describe('Authentication', () => {
		it('should return 401 if client is not authenticated', async function () {
			const res = await request(global.app).delete('/sensor/65ecd6fbc66268658ae1fd09')
			expect(res.status).toBe(401)
		})
	})

	describe('Schema validation', () => {
		it('should validate sensorId correctly', async function() {
			const user = await db.createDummyUser()
			const res = await authenticatedAgent(user).delete('/sensor/123')
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must match pattern "^[0-9a-fA-F]{24}$"')
		})
	})

	describe('Logic', () => {
		it('should delete a sensor', async function() {
			const user = await db.createDummyUser()
			const sensor = await db.createDummySensor(user._id)
			const res = await authenticatedAgent(user).delete(`/sensor/${sensor._id}`)
			expect(res.status).toBe(200)
			expect(res.body.message).toBe('Sensor deleted successfully')
		})

		it('should error if sensor does not exist', async function() {
			const user = await db.createDummyUser()
			const res = await authenticatedAgent(user).delete('/sensor/65ecd6fbc66268658ae1fd09')
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
			const res = await authenticatedAgent(user2).delete(`/sensor/${sensor._id}`)
			expect(res.status).toBe(404)
			expect(res.body.error.message).toBe('Sensor not found')
		})
	})
})