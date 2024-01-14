const logger = require('../utils/logger')

module.exports = (req, _res, next) => {
	logger.info(`${req.method} ${req.originalUrl}`)
	next()
}