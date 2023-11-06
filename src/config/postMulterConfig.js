const multer = require('multer')
const path = require('path')
const { getDate } = require('../utils/mediaUtils')

const storage = multer.diskStorage({
  destination: './images/posts/',
  filename: (req, file, cb) => {
    let username = req.user.username
    let created_at = getDate()
    const filename = `post_media_${username}_${created_at}${path.extname(file.originalname)}`
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true) // Accept images
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false)
  }
}

const uploadPost = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('post_media')

module.exports = uploadPost