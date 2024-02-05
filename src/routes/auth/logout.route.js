const User = require('../../entities/user')

module.exports.post = {
	method: 'POST',
	path: '/logout',
	schema: {},
	handler: async (req, res, _next) => {
		const { refreshToken } = req.body
		try {
			const user = await User.findOne({ refreshToken })
			if (!user) {
				return res.status(403).json({ message: 'Invalid refresh token' })
			}
			user.refreshToken = null
			await user.save()
			res.json({ message: 'User logged out successfully' })
		} catch (error) {
			console.error('Error in /logout route:', error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	},
}
