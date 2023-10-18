const express = require('express')

const router = express.Router()

const UsersController = require('../controller/users.js')
// const middlewareToken = require('./middleware/auth')

//READ
router.get('/', UsersController.getAllUsers)
//REGISTER
router.post('/register', UsersController.registerUser)
//LOGIN
router.post('/login', UsersController.loginUser)



module.exports = router