const Sensor = require('../../entities/sensor')

module.exports.delete = {
	method: 'DELETE',
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

		await sensor.deleteOne()

		res.status(200).send({
			message: 'Sensor deleted successfully'
		})
	}
}
