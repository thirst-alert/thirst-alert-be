const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')
const logger = require('../utils/logger')
const User = require('../entities/user')
const passport = require('passport')

require('dotenv').config()

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
	algorithms: ['HS256']
}

module.exports = {
	strategy: new JwtStrategy(opts, async (payload, done) => {
		try {
			const user = await User.findOne({ username: payload.username })

			if (user) {
				return done(null, user)
			} else {
				return done(null, false)
			}
		} catch (error) {
			return done(error, false)
		}
	}),

	authenticate: (req, res, next) => {
		return passport.authenticate('jwt', { session: false }, (err, user) => {
			if (err) {
				logger.error('Authentication error')
				return next(new StatusError('Internal Server Error', 500))
			}
			if (!user) {
				logger.error('Unauthorized access')
				return next(new StatusError('Invalid access token', 401))
			}
			req.user = user
			next()
		})(req, res, next)
	}
}
