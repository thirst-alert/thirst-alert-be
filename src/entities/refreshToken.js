const mongoose = require('mongoose')
const { Schema } = mongoose

const refreshTokenSchema = new Schema({
	token: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	expiresAt: Date,
}, {
	collection: 'refreshToken',
})

module.exports = mongoose.model('refreshToken', refreshTokenSchema)