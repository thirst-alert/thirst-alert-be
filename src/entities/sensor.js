const mongoose = require('mongoose')
const { Schema } = mongoose

const sensorSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	active: {
		type: Boolean,
		default: true
	},
	img: {
		type: Buffer,
		required: false
	}
}, {
	collection: 'sensor',
	timestamps: true,
	methods: {
		toJSON() {
			return {
				id: this._id,
				name: this.name,
				active: this.active,
				img: this.img || []
			}
		}
	}
})

module.exports = mongoose.model('sensor', sensorSchema)