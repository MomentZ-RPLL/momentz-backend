const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './images/posts/',
  filename: (req, file, cb) => {
    let username = req.user.username
    const filename = `post_media_${username}_${req.body.created_at}${path.extname(file.originalname)}`
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