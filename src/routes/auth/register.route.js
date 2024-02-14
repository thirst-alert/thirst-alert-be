const bcrypt = require('bcryptjs')
const User = require('../../entities/user')

module.exports.post = {
	method: 'POST',
	path: '/auth/register',
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
		const existingUser = await User.findOne({ username })
		if (existingUser) {
			return next(new StatusError('Please choose a different name', 409))
		}
		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = new User({
			username,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		const savedUser = await newUser.save()
		res.status(201).send({ message: 'User registered successfully', user: savedUser.toJWTPayload() })
	}
}