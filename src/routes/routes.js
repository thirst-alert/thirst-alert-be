const { bindCustomRegistrationToRouter } = require('../utils/route-registration')

module.exports.attachRoutes = (router) => {
	bindCustomRegistrationToRouter(router)

	router.registerRoute(require('./auth/register.route').post)
	router.registerRoute(require('./auth/register.route').verify)
	router.registerRoute(require('./auth/login.route').post)
	router.registerRoute(require('./auth/refresh.route').post)
	router.registerRoute(require('./user/me.route').get)
	router.registerRoute(require('./user/patch-password.route').patch)
	router.registerRoute(require('./user/reset-password.route').get)
	router.registerRoute(require('./user/reset-password.route').post)
	router.registerRoute(require('./user/reset-password.route').patch)
	router.registerRoute(require('./user/delete.route').delete)
	router.registerRoute(require('./measurement/post.route').post)
}