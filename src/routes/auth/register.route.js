const bcrypt = require('bcryptjs')
const { mailer } = require('../../config')
const User = require('../../entities/user')
const VerifyEmailToken = require('../../entities/verifyEmailToken')

const generateToken = () => {
	const max = Math.pow(10, 7)
	const min = max / 10
	const rndInt = Math.floor(Math.random() * (max - min + 1) ) + min

	return ('' + rndInt).substring(1)
}

module.exports.post = {
	method: 'POST',
	path: '/auth/register',
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['username', 'email', 'password'],
			properties: {
				username: {
					type: 'string',
				},
				email: {
					type: 'string',
					format: 'email',
				},
				password: {
					type: 'string',
				},
			},
		},
	},
	handler: async (req, res, next) => {
		const { username, email, password } = req.body

		const existingUsername = await User.findOne({ username })
		const existingEmail = await User.findOne({ email })
		if (existingUsername) return next(new StatusError('Username already in use', 409))
		if (existingEmail) return next(new StatusError('Email already in use', 409))

		const hashedPassword = await bcrypt.hash(password, 10)

		try {
			// probably should be a transaction, but mongo support transactions only for replica sets.
			// this could fail at any point, and data could be inconsistent
			// consider switching to replica set
			const newUser = await User.create({
				username,
				email,
				password: hashedPassword,
			})

			const verifyEmailToken = await VerifyEmailToken.create({
				token: generateToken(),
				owner: newUser._id
			})

			await mailer.sendMail({
				to: email,
				subject: 'Thirst Alert - Verify your email address',
				template: 'verifyEmail',
				context: {
					username: newUser.username,
					token: verifyEmailToken.token.split('')
				}
			})

			res.status(201).send({ message: 'User registered successfully', user: newUser.toJWTPayload() })
		} catch (error) {
			next(new StatusError('Failed to register user', 500))
		}
	}
}

module.exports.verify = {
	method: 'POST',
	path: '/auth/verify',
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['token', 'email'],
			properties: {
				token: {
					type: 'string',
				},
				email: {
					type: 'string',
					format: 'email',
				},
			},
		},
	},
	handler: async (req, res, next) => {
		const { token, email } = req.body

		const verifyEmailToken = await VerifyEmailToken.findOne({ token }).populate('owner')
		if (!verifyEmailToken) return next(new StatusError('Invalid token', 400))
		const user = verifyEmailToken.owner
		if (user.email !== email) return next(new StatusError('Invalid email', 400))

		await User.updateOne({ _id: user._id }, { active: true })
		await VerifyEmailToken.deleteOne({ _id: verifyEmailToken._id })

		res.status(200).send({ message: 'Email verified successfully' })
	}
}