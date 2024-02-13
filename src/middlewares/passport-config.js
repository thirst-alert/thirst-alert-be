const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')
require('dotenv').config()

const User = require('../entities/user')

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
}

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, async (jwt_payload, done) => {
			try {
				const user = await User.findOne({ username: jwt_payload.username })

				if (user) {
					return done(null, user)
				} else {
					return done(null, false)
				}
				// clean error handling
			} catch (error) {
				return done(error, false)
			}
		})
	)
}
