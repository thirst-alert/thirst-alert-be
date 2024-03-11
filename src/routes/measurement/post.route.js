const Measurement = require('../../entities/measurement')

module.exports.post = {
	method: 'POST',
	path: '/measurement/:sensorId',
	schema: {
		params: {
			type: 'object',
			additionalProperties: false,
			required: ['sensorId'],
			properties: {
				sensorId: {
					type: 'string',
					pattern: '^[0-9a-fA-F]{24}$'
				}
			},
		},
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['temperature', 'moisture'],
			properties: {
				temperature: {
					type: 'number',
				},
				moisture: {
					type: 'integer',
				}
			},
		},
	},
	handler: async (req, res, _next) => {
		const { temperature, moisture } = req.body
		const { sensorId } = req.params

		await Measurement.create({
			temperature,
			moisture,
			metadata: {
				sensorId
			}
		})
		return res.status(200).send('OK')
	}
}
