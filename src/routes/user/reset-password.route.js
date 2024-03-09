const { mailer, server: { baseUrl } } = require('../../config')
const User = require('../../entities/user')
const ResetPasswordToken = require('../../entities/resetPasswordToken')

module.exports.post = {
	method: 'POST',
	path: '/user/reset-password',
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['email'],
			properties: {
				email: {
					type: 'string',
					format: 'email'
				}
			},
		},
	},
	handler: async (req, res, _next) => {
		const { email } = req.body

		const user = await User.findOne({ email })
		if (user) {
			const resetPasswordToken = await ResetPasswordToken.create({ owner: user._id })
			await mailer.sendMail({
				to: user.email,
				subject: 'Thirst Alert - Reset your password',
				template: 'resetPassword',
				context: {
					username: user.username,
					reset_url: `${baseUrl}/user/reset-password?token=${resetPasswordToken.token}&userId=${user._id}`
				}
			})
		} else {
			// await a random time between 1 and 2 seconds to mitigate timing attacks
			await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000))
		}
		res.status(200).send({ message: 'An email with reset instructions has been sent to the given account if it exists' })
	}
}

module.exports.get = {
	method: 'GET',
	path: '/user/reset-password',
	schema: {
		querystring: {
			type: 'object',
			additionalProperties: false,
			required: ['token', 'userId'],
			properties: {
				token: {
					type: 'string'
				},
				userId: {
					type: 'string'
				}
			}
		}
	},
	handler: async (req, res, _next) => {
		const { token, userId } = req.query

		const resetPasswordToken = await ResetPasswordToken.findOne({ token }).populate('owner')
		if (!resetPasswordToken || resetPasswordToken.owner._id.toString() !== userId) return res.render('resetPasswordInvalid')

		return res.render('resetPassword', {
			reset_url: `${baseUrl}/user/reset-password`,
			token,
			userId
		})
	}
}

module.exports.patch = {
	method: 'PATCH',
	path: '/user/reset-password',
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['token', 'userId', 'password'],
			properties: {
				token: {
					type: 'string'
				},
				password: {
					type: 'string'
				},
				userId: {
					type: 'string'
				}
			}
		}
	},
	handler: async (req, res, next) => {
		const { token, userId, password } = req.body

		const resetPasswordToken = await ResetPasswordToken.findOne({ token }).populate('owner')
		if (!resetPasswordToken || resetPasswordToken.owner._id.toString() !== userId) return next(new StatusError('Invalid reset token', 403))

		const user = resetPasswordToken.owner
		user.password = password
		await user.save()
		await resetPasswordToken.deleteOne()

		res.status(200).send({ message: 'Password reset successfully' })
	}
}