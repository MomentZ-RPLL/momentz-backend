const express = require('express')

const router = express.Router()
const uploadProfilePicture = require('../config/multerConfig')
const UsersController = require('../controller/users.js')
// const middlewareToken = require('./middleware/auth')

//REGISTER
router.post('/register', uploadProfilePicture, UsersController.registerUser)
//LOGIN
router.post('/login', UsersController.loginUser)
//GET USER
router.get('/:username', UsersController.getUser)
//LOGOUT
router.post('/logout', UsersController.logoutUser)

module.exports = router