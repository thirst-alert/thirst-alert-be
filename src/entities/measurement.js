const mongoose = require('mongoose')
const { Schema } = mongoose

const measurementSchema = new Schema({
	moisture: Number,
	temperature: Number,
	createdAt: Date,
	metadata: {
		sensorId: String
	}
}, {
	collection: 'measurement',
	timeseries: {
		timeField: 'createdAt',
		metaField: 'metadata',
		granularity: 'minutes',
	}
})

module.exports = mongoose.model('measurement', measurementSchema)