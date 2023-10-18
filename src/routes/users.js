const express = require('express')

const router = express.Router()

const UsersController = require('../controller/users.js')


//READ
router.post('/register', UsersController.registerUser)


module.exports = router