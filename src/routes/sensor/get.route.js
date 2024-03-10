const Sensor = require('../../entities/sensor')

module.exports.getAll = {
	method: 'GET',
	path: '/sensor',
	requiresAuth: true,
	handler: async (req, res, _next) => {
		const { user: { _id: owner } } = req

		const sensors = await Sensor.find({ owner })

		res.status(200).send({
			message: 'Sensors fetched successfully',
			sensors: sensors.map(sensor => sensor.toJSON())
		})
	}
}

module.exports.getOne = {
	method: 'GET',
	path: '/sensor/:sensorId',
	requiresAuth: true,
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
			}
		}
	},
	handler: async (req, res, next) => {
		const { user: { _id: owner } } = req
		const { sensorId } = req.params

		const sensor = await Sensor.findOne({ _id: sensorId, owner })
		if (!sensor) return next(new StatusError('Sensor not found', 404))

		res.status(200).send({
			message: 'Sensor fetched successfully',
			sensor: sensor.toJSON()
		})
	}
}
