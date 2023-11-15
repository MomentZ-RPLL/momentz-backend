const express = require('express')

const router = express.Router()
const timelineController = require('../controller/timeline.js')
const middlewareToken = require('../middleware/auth')

//TIMELINE
router.get('/', middlewareToken, timelineController.getTimeline)

module.exports = router