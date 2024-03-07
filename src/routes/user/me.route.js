module.exports.get = {
	method: 'GET',
	path: '/me',
	requiresAuth: true,
	handler: (req, res, _next) => {
		return res.status(200).send(req.user.toJWTPayload())
	}
}