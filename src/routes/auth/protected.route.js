const passport = require('passport')
require('../../middlewares/passport-config')(passport)

module.exports.get = {
	method: 'GET',
	path: '/protected',
	handler: (req, res) => {
		res.json({ message: 'Access granted to protected route', user: req.user })
	},
	config: {
		auth: 'jwt',
	},
}