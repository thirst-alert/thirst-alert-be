const router = require('express').Router()

router.get('/test', (_req, res) => {
  res.send('test')
})

module.exports = router