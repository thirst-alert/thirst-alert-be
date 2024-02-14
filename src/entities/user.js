const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
	username: String,
	password: String,
	createdAt: Date,
	updatedAt: Date
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