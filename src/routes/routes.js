const { bindCustomRegistrationToRouter } = require('../utils/route-registration')

module.exports.attachRoutes = (router) => {
	bindCustomRegistrationToRouter(router)

	router.registerRoute(require('./user/post.route').post)
	router.registerRoute(require('./auth/register.route').post)
	router.registerRoute(require('./auth/login.route').post)
	router.registerRoute(require('./auth/token.route').post)
	router.registerRoute(require('./auth/protected.route').get)
	router.registerRoute(require('./auth/logout.route').post)
}