const dbPool = require('../config/database')
const ErrorResponse = require('../utils/errorResponse')

exports.postMedia = async (data) => {
  try {

    if (data.file === undefined) {
      throw new ErrorResponse(400, 'file is required')
    }
    if (data.body.caption === undefined) {
      data.body.caption = ""
    }

    const query = `INSERT INTO posts SET ?`
    const value = {
      id_user: data.user.id_user,
      caption: data.body.caption,
      post_media: data.file.filename,
      created_at: data.body.created_at
    }

    return await dbPool.query(query, value)
  } catch (error) {
    throw new ErrorResponse(500, error.message)
  }
}