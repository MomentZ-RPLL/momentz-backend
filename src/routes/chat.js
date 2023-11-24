const express = require('express')

const router = express.Router()
const chatController = require('../controller/chat.js')
const middlewareToken = require('../middleware/auth')

//GET ALL CHAT
router.get('/', middlewareToken, chatController.getAllChat)
//GET DETAIL CHAT
router.get('/:id_user', middlewareToken, chatController.getDetailChat)
//POST CHAT
router.post('/:id_user', middlewareToken, chatController.postChat)

module.exports = router