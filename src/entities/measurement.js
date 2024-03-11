const mongoose = require('mongoose')
const { Schema } = mongoose

const measurementSchema = new Schema({
	moisture: {
		type: Number,
		required: true
	},
	temperature: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	metadata: {
		sensorId: {
			type: Schema.Types.ObjectId,
			ref: 'sensor'
		}
	}
}, {
	collection: 'measurement',
	timeseries: {
		timeField: 'createdAt',
		metaField: 'metadata',
		granularity: 'minutes',
	}
})

measurementSchema.pre('save', function(next) {
	if (!this.isModified('moisture')) return next()
	this.moisture = Math.round(this.moisture / 10)
	next()
})

module.exports = mongoose.model('measurement', measurementSchema)