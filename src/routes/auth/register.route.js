const bcrypt = require('bcryptjs')
const User = require('../../entities/user')

module.exports.post = {
	method: 'POST',
	path: '/register',
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
		const existingUser = await User.findOne({ username })
		if (existingUser) {
			return res.status(400).json({ message: 'Please choose a different name.'})
		}
		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = new User({
			username,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		const savedUser = await newUser.save()
		res.status(201).json({ message: 'User registered successfully', user: savedUser })
	}
}