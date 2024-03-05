const Measurement = require('../../entities/measurement')

module.exports.get = {
	method: 'GET',
	path: '/measurement',
	schema: {
	},
	handler: async (req, res, _next) => {
		// const { temperature, moisture, sensorId } = req.body

		// const measurement = new Measurement({
		// 	temperature,
		// 	moisture,
		// 	createdAt: new Date(),
		// 	metadata: {
		// 		sensorId
		// 	}
		// })
		// await measurement.save()
		const measurements = await Measurement.find()
		return res.status(200).send(measurements)
	}
}
