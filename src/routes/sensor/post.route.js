const Sensor = require('../../entities/sensor')

module.exports.post = {
	method: 'POST',
	path: '/sensor',
	requiresAuth: true,
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['name'],
			properties: {
				name: {
					type: 'string',
					minLength: 1,
					maxLength: 32
				}
				// img: {
				//   type: 'string',
				//   format: 'binary'
				// }
			},
		},
	},
	handler: async (req, res, _next) => {
		const { user: { _id: owner } } = req
		const { name } = req.body

		const sensor = await Sensor.create({
			name,
			owner
		})

		res.status(200).send({
			message: 'Sensor created successfully',
			sensor: sensor.toJSON()
		})
	}
}
