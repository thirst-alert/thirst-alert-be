const mongoose = require('mongoose')
const { Schema } = mongoose

const verifyEmailTokenSchema = new Schema({
	token: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
}, {
	collection: 'verifyEmailToken',
})

module.exports = mongoose.model('verifyEmailToken', verifyEmailTokenSchema)