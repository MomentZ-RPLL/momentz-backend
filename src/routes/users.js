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

//FOLLOW
router.post('/follow/:id', middlewareToken, UsersController.followUser)
//REMOVE FOLLOW
router.delete('/follow/:id', middlewareToken, UsersController.removeFollow)

//GET COMMENT
router.get('/:id_post/comments', middlewareToken, UsersController.getComment)
//ADD COMMENT
router.post('/:id_post/comments', middlewareToken, UsersController.addComment)
//DELETE COMMENT
router.delete('/:id_post/comments', middlewareToken, UsersController.deleteComments)

//GET LIKES
router.get('/:id_post/likes', middlewareToken, UsersController.getLikes)
//ADD LIKES
router.post('/:id_post/likes', middlewareToken, UsersController.addLikes)
//UNLIKES
router.delete('/:id_post/likes', middlewareToken, UsersController.unLikes)



module.exports = router