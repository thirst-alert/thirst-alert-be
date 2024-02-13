const jwt = require('jsonwebtoken')
const User = require('../../entities/user')

module.exports.post = {
	method: 'POST',
	path: '/token',
	schema: {},
	handler: async (req, res, _next) => {
		const { refreshToken } = req.body
		try {
			const user = await User.findOne({ refreshToken })
			if (!user) {
				return res.status(403).json({ message: 'Invalid refresh token' })
			}
			const newToken = jwt.sign(
				{ username: user.username },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)
			res.json({ message: 'New access token generated', token: newToken })
		} catch (error) {
			console.error('Error in /token route:', error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	},
}