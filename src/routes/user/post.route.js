module.exports.post = {
	method: 'POST',
	path: '/test',
	requiresAuth: true,
	handler: async (req, res, _next) => {
		res.status(200).send(req.user)
	}
}