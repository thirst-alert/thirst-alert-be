module.exports.patch = {
	method: 'PATCH',
	path: '/user/patch-password',
	requiresAuth: true,
	schema: {
		body: {
			type: 'object',
			additionalProperties: false,
			required: ['oldPassword', 'newPassword'],
			properties: {
				oldPassword: {
					type: 'string',
				},
				newPassword: {
					type: 'string',
				},
			},
		},
	},
	handler: async (req, res, next) => {
		const { user } = req
		const { oldPassword, newPassword } = req.body

		if (!user.comparePassword(oldPassword)) return next(new StatusError('Invalid password', 400))

		user.password = newPassword
		await user.save()
		return res.status(200).send({message: 'Password updated successfully'})
	}
}