const router = require('express').Router()
const userRouter = require('./user/test')

router.use('/user', userRouter)

module.exports = router