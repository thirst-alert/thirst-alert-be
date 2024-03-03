const logger = require('../utils/logger')

global.StatusError = class extends Error {
	constructor(message, status) {
		super(message)
		this.status = status
	}
}

exports.noPathHandler = (_req, _res, next) =>
	next(new StatusError('Path not found', 404))

exports.errorHandler = (err, _req, res, _next) => {
	if (err instanceof StatusError) {
		const { message, status } = err
		logger.error(`${status} - ${message}`)
		return res.status(status).send({
			error: { message }
		})
	}
	if (process.env.ERR_VERBOSE === 'true') {
		logger.fatal(`Uncaught error: ${err.stack}`)
		return res.status(500).send({
			err: err.stack,
		})
	} else {
		logger.error('500 - Something went wrong')
		return res.status(500).send({
			error: { message: 'Something went wrong' }
		})
	}
}