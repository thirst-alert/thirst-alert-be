const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../../entities/user')
const RefreshToken = require('../../entities/refreshToken')

module.exports.post = {
	method: 'POST',
	path: '/auth/login',
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['username', 'password'],
			properties: {
				username: {
					type: 'string',
				},
				password: {
					type: 'string',
				},
			},
		},
	},
	handler: async (req, res, next) => {
		const { username, password } = req.body

		const user = await User.findOne({ username })
		if (!user) {
			return next(new StatusError('User', 400))
		}

		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) {
			return next(new StatusError('User', 400))
		}

		await RefreshToken.deleteMany({ owner: user._id }) // delete refresh tokens for this user
		const refreshToken = new RefreshToken({
			token: crypto.randomBytes(64).toString('hex'),
			owner: user._id,
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
		})
		await refreshToken.save()

		const token = jwt.sign(
			user.toJWTPayload(),
			process.env.JWT_SECRET,
			{
				expiresIn: '1h',
			}
		)
		return res.status(200).send({
			message: 'Logged in successfully',
			token,
			refreshToken: refreshToken.token,
			user: user.toJWTPayload()
		})
	},
}
