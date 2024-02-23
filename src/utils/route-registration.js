const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const { authenticate } = require('../middlewares/passport-config')
const logger = require('./logger')

function bindCustomRegistrationToRouter(router) {
	router.registerRoute = registerRoute.bind(router)
}

function generateSchemaValidators(schema) {
	const validators = []

	if (!schema.querystring && !schema.body && !schema.params) return validators

	// TODO: allow ajv options in schema and load them up here if they're present in the route schema
	const ajv = new Ajv()
	addFormats(ajv)
	if (schema.querystring) {
		const validate = ajv.compile(schema.querystring)
		validators.push(function prevalidationQuerystringHandler (req, res, next) {
			const valid = validate(req.query)

			if (validate.errors) logger.warn(`Request querystring validation error: ${validate.errors[0].message}`)

			if (!valid) {
				return res.status(422).json({
					status: 422,
					msg: 'Request querystring could not be accepted. Errors follow',
					result: validate.errors
				})
			}

			next()
		})
	}

	if (schema.params) {
		const validate = ajv.compile(schema.params)
		validators.push(function prevalidationParamsHandler (req, res, next) {
			const valid = validate(req.params)

			if (validate.errors) logger.warn(`Request params validation error: ${validate.errors[0].message}`)

			if (!valid) {
				return res.status(422).json({
					status: 422,
					msg: 'Request paramaters could not be accepted. Errors follow',
					result: validate.errors
				})
			}

			next()
		})
	}

	if (schema.body) {
		const validate = ajv.compile(schema.body)

		validators.push(function prevalidationBodyHandler (req, res, next) {
			const valid = validate(req.body)

			if (validate.errors) logger.warn(`Request body validation error: ${validate.errors[0].message}`)

			if (!valid) {
				return res.status(422).json({
					msg: 'Request body could not be accepted. Errors follow',
					result: validate.errors
				})
			}

			next()
		})
	}
	return validators
}

function registerRoute(definition) {
	const { method, path, handler, schema = {}, requiresAuth = false } = definition

	const handlers = [
		...requiresAuth ? [authenticate] : [],
		...generateSchemaValidators(schema),
		handler
	]

	this[method.toLowerCase()](path, handlers)
}

module.exports = {
	bindCustomRegistrationToRouter
}