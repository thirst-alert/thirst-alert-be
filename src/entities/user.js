const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

const userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	active: {
		type: Boolean,
		default: false
	}
}, {
	collection: 'user',
	methods: {
		toJWTPayload() {
			return {
				id: this._id,
				username: this.username,
				email: this.email
			}
		},
		comparePassword(password) {
			return bcrypt.compareSync(password, this.password)
		}
	},
	timestamps: true
})

userSchema.pre('save', function(next) {
	if (!this.isModified('password')) return next()
	this.password = bcrypt.hashSync(this.password, 10)
	next()
})

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
	await mongoose.model('refreshToken').deleteMany({ owner: this._id })
	// delete any other related data...
	next()
})

module.exports = mongoose.model('user', userSchema)