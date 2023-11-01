const dbPool = require('../config/database')

exports.postMedia = async (data) => {
  try {

    if (data.file === undefined) {
      throw new Error('no file detected')
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
    throw new Error(error)
  }
}