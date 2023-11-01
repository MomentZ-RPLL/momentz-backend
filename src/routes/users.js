const express = require('express')

const router = express.Router()
const uploadProfilePicture = require('../config/profileMulterConfig')
const UsersController = require('../controller/users.js')
const middlewareToken = require('../middleware/auth')

//REGISTER
router.post('/register', uploadProfilePicture, UsersController.registerUser)
//LOGIN
router.post('/login', UsersController.loginUser)
//GET USER
router.get('/:username', middlewareToken, UsersController.getUser)
//LOGOUT
router.post('/logout', UsersController.logoutUser)
//UPDATE USER
router.put('/:username', middlewareToken, uploadProfilePicture, UsersController.updateUser)

//GET COMMENT
router.get('/:id_post/comments', middlewareToken, UsersController.getComment)
//ADD COMMENT
router.post('/:id_post/comments', middlewareToken, UsersController.addComment)

//GET LIKES
router.get('/:id_post/likes', middlewareToken, UsersController.getLikes)
//ADD LIKES
router.post('/:id_post/likes', middlewareToken, UsersController.addLikes)


module.exports = router