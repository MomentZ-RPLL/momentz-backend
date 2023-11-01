const express = require('express')

const router = express.Router()
const uploadPost = require('../config/postMulterConfig')
const mediaController = require('../controller/photos.js')
const middlewareToken = require('../middleware/auth')

//NEW POST
router.post('/',middlewareToken, uploadPost, mediaController.postMedia)

module.exports = router