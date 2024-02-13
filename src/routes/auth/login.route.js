const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../../entities/user')

module.exports.post = {
	method: 'POST',
	path: '/login',
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
	handler: async (req, res, _next) => {
		const { username, password } = req.body

		const user = await User.findOne({ username })
		if (!user) {
			return res.status(400).json({ message: 'Invalid username or password' })
		}

		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) {
			return res.status(400).json({ message: 'Invalid username or password' })
		}
		
		const refreshToken = crypto.randomBytes(64).toString('hex')
		user.refreshToken = refreshToken
		await user.save()

		const token = jwt.sign(
			{ username: user.username },
			process.env.JWT_SECRET,
			{
				expiresIn: '1h',
			}
		)
		res.json({ message: 'Logged in successfully', token, refreshToken })
	},
}
