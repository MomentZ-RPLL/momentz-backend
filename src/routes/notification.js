const express = require('express')

const router = express.Router()
const middlewareToken = require('../middleware/auth')
const NotifController = require('../controller/notification.js')

//GET NOTIF COMMENTS
router.get('/:id_post/comments',middlewareToken, NotifController.getNotifComment)
//GET NOTIF LIKES
router.get('/:id_post/likes',middlewareToken, NotifController.getNotifLikes)
//GET NOTIF FOLLOW
router.get('/follow',middlewareToken, NotifController.getNotifLikes)


module.exports = router