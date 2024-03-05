describe('TTL', () => {
	it('should delete expired measurements', async function() {
    await new Promise(resolve => setTimeout(resolve, 5000))
		await global.dbConnection.models.measurement.create({
			temperature: 1,
			moisture: 1,
			metadata: {
				sensorId: 'test'
			},
			createdAt: new Date()
		})
		await new Promise(resolve => setTimeout(resolve, 90000))
		const measurements = await global.dbConnection.models.measurement.find()
		expect(measurements).toHaveLength(0)
	}, 120000)
})
