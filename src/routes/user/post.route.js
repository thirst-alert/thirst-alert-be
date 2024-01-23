const User = require('../../entities/user')

module.exports.post = {
	method: 'POST',
	path: '/test',
	schema: {
		body: {
      type: 'object',
      additionalProperties: false,
      required: [
        'username'
      ],
      properties: {
				username: {
					type: 'string'
				}
			}
		}
	},
	handler: async (req, res, next) => {
		const { username } = req.body

		const user = await User.findOne({ username })
		if (!user) return next(new StatusError('User', 404))
		res.json(user)
	}
}