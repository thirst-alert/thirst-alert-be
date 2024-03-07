module.exports.delete = {
	method: 'DELETE',
	path: '/user',
	requiresAuth: true,
	handler: async (req, res, _next) => {
		await req.user.deleteOne()
		return res.status(200).send({message: 'User deleted successfully'})
	}
}