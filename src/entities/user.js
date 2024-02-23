const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	active: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	updatedAt: {
		type: Date,
		default: new Date()
	}
}, {
	collection: 'user',
	methods: {
		toJWTPayload() {
			return {
				id: this._id,
				username: this.username
			}
		}
	}
})

module.exports = mongoose.model('user', userSchema)