const dbPool = require('../config/database')

exports.getPostByUsername = async (username) => {
  const query = 'select * from posts where username = ?'

  return dbPool.execute(query, [username])
}

exports.getPostByPostId = async (id) => {
  const query = 'select * from posts where id_post = ?'

  return dbPool.execute(query, [id])
}

exports.getProfilePictureURL = (filename) => {
  return `${process.env.PROFILE_PATH}${filename}`
}

exports.getDate = () => {
  return new Date().toISOString().slice(0, 19).replace(/-/g, "").replace(/:/g, "").replace("T", "")
}