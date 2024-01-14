const User = require('../../entities/user')
const router = require('express').Router()

router.get('/test/:username', async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ username })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
})

module.exports = router