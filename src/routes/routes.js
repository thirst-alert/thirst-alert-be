const { bindCustomRegistrationToRouter } = require('../utils/route-registration')

module.exports.attachRoutes = (router) => {
	bindCustomRegistrationToRouter(router)

	router.registerRoute(require('./user/post.route').post)
	router.registerRoute(require('./auth/register.route').post)
	router.registerRoute(require('./auth/login.route').post)
	router.registerRoute(require('./auth/refresh.route').post)
	router.registerRoute(require('./measurement/post.route').post)
}