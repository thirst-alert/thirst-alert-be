const User = require('../../entities/user')
const router = require('express').Router()

router.get('/test/:username', async (req, res, next) => {
	const { username } = req.params

	const user = await User.findOne({ username })
	if (!user) return next(new StatusError('User', 404))
	res.json(user)
})

module.exports = router