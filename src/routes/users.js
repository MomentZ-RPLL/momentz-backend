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
router.get('/profile/:username', middlewareToken, UsersController.getUser)
//LOGOUT
router.post('/logout', UsersController.logoutUser)
//UPDATE USER
router.put('/profile/:username', middlewareToken, uploadProfilePicture, UsersController.updateUser)

//FOLLOW
router.post('/follow/:id', middlewareToken, UsersController.followUser)
//REMOVE FOLLOW
router.delete('/follow/:id', middlewareToken, UsersController.removeFollow)
//GET FOLLOWER
router.get('/:id/followers', middlewareToken, UsersController.getFollowers)
//GET FOLLOWING
router.get('/:id/following', middlewareToken, UsersController.getFollowing)

//SEARCH USER
router.get('/search', middlewareToken, UsersController.searchUser)


module.exports = router