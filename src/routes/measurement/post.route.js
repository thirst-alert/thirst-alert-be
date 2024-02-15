const Measurement = require('../../entities/measurement')

module.exports.post = {
	method: 'POST',
	path: '/measurement',
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['temperature', 'moisture', 'sensorId'],
			properties: {
				temperature: {
					type: 'number',
				},
				moisture: {
					type: 'number',
				},
        sensorId: {
          type: 'string',
        }
			},
		},
	},
	handler: async (req, res, next) => {
    const { temperature, moisture, sensorId } = req.body

    const measurement = new Measurement({
      temperature,
      moisture,
      createdAt: new Date(),
      metadata: {
        sensorId
      }
    })
    await measurement.save()
    return res.status(200).send('OK')
  }
}
