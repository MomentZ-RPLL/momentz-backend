const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './images/profile_pictures/',
  filename: (req, file, cb) => {
    const username = req.body.username // Assuming the username is sent in the request body

    const filename = `${file.fieldname}-${username}${path.extname(file.originalname)}`
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

const uploadProfilePicture = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('profile_picture')

module.exports = uploadProfilePicture