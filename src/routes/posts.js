const express = require('express')

const router = express.Router()
const uploadPost = require('../config/postMulterConfig.js')
const postControllers = require('../controller/posts.js')
const middlewareToken = require('../middleware/auth.js')

//NEW POST
router.post('/',middlewareToken, uploadPost, postControllers.postMedia)
//DETAIL POST
router.get('/:id_post',middlewareToken, postControllers.getMedia)
//DELETE POST
router.delete('/:id_post',middlewareToken, postControllers.deleteMedia)

//GET COMMENT
router.get('/:id_post/comments', middlewareToken, postControllers.getComment)
//ADD COMMENT
router.post('/:id_post/comments', middlewareToken, postControllers.addComment)
//DELETE COMMENT
router.delete('/:id_post/comments', middlewareToken, postControllers.deleteComments)

//GET LIKES
router.get('/:id_post/likes', middlewareToken, postControllers.getLikes)
//ADD LIKES
router.post('/:id_post/likes', middlewareToken, postControllers.addLikes)
//UNLIKES
router.delete('/:id_post/likes', middlewareToken, postControllers.unLikes)

module.exports = router