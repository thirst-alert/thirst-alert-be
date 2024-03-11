const request = require('supertest')
const { db } = require('../../helpers')

afterEach(async () => {
	await db.dropCollections()
})

describe('POST /measurement/:sensorId', () => {
	describe('Schema validation', () => {
		it('should validate sensorId correctly', async function() {
			const res = await request(global.app).post('/measurement/123').send({
				temperature: 25,
				moisture: 50
			})
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must match pattern "^[0-9a-fA-F]{24}$"')
		})

		it('should validate temperature correctly', async function() {
			const res = await request(global.app).post('/measurement/65ecd6fbc66268658ae1fd09').send({
				temperature: 'notanumber',
				moisture: 50
			})
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must be number')
		})

		it('should validate moisture correctly', async function() {
			const res = await request(global.app).post('/measurement/65ecd6fbc66268658ae1fd09').send({
				temperature: 25,
				moisture: 'notaninteger'
			})
			expect(res.status).toBe(422)
			expect(res.body.result[0].message).toBe('must be integer')
		})
	})

	describe('Logic', () => {
		it('should create a measurement', async function() {
			const res = await request(global.app).post('/measurement/65ecd6fbc66268658ae1fd09').send({
				temperature: 25.7,
				moisture: 50
			})
			expect(res.status).toBe(200)
			expect(res.text).toBe('OK')
			const measurements = await global.dbConnection.models.measurement.find()
			expect(measurements.length).toBe(1)
		})
	})
})