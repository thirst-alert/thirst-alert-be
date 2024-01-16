const { bindCustomRegistrationToRouter } = require('../utils/route-registration')

module.exports.attachRoutes = (router) => {
	bindCustomRegistrationToRouter(router)

	router.registerRoute(require('./user/post.route').post)
}