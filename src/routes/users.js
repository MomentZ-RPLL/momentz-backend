const express = require('express')

const router = express.Router()

const UsersController = require('../controller/users.js')
// const middlewareToken = require('./middleware/auth')

//READ
<<<<<<< HEAD
router.get('/', UsersController.getAllUsers)
//REGISTER
=======
>>>>>>> 128ebf30592642182d1ff873fb20459a373c43ca
router.post('/register', UsersController.registerUser)
//LOGIN
router.post('/login', UsersController.loginUser)



module.exports = router