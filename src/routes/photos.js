const express = require('express')

const router = express.Router()
const uploadPost = require('../config/postMulterConfig')
const mediaController = require('../controller/photos.js')
const middlewareToken = require('../middleware/auth')

//NEW POST
router.post('/',middlewareToken, uploadPost, mediaController.postMedia)
//DETAIL POST
router.get('/:id_post',middlewareToken, mediaController.getMedia)
//DELETE POST
router.delete('/:id_post',middlewareToken, mediaController.deleteMedia)

module.exports = router