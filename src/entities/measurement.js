const mongoose = require('mongoose')
const { Schema } = mongoose

const measurementSchema = new Schema({
	moisture: Number,
	temperature: Number,
	createdAt: {
		type: Date,
		default: new Date()
	},
	metadata: {
		sensorId: String
	}
}, {
	collection: 'measurement',
	timeseries: {
		timeField: 'createdAt',
		metaField: 'metadata',
		granularity: 'seconds',
	},
	expireAfterSeconds: 10
})

// measurementSchema.index( {'createdAt': 1 }, {
//   partialFilterExpression: {
//     'metadata.sensorId': { '$eq': '1234567890' }
//   },
//   expireAfterSeconds: 60,
//   name: 'ttlindex',
//   background: true
// })

module.exports = mongoose.model('measurement', measurementSchema)
