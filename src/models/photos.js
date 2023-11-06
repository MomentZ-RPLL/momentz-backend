const dbPool = require('../config/database')
const ErrorResponse = require('../utils/errorResponse')
const { getPostByPostId, getDate } = require('../utils/mediaUtils')

exports.postMedia = async (data) => {
    if (data.file === undefined) {
        throw new ErrorResponse(400, 'file is required')
    }
    if (data.body.caption === undefined) {
        data.body.caption = ""
    }

    const created_at = getDate()

    const query = `INSERT INTO posts SET ?`
    const value = {
        id_user: data.user.id_user,
        caption: data.body.caption,
        post_media: data.file.filename,
        created_at: created_at
    }
    return await dbPool.query(query, value)
}

exports.deleteMedia = async (data) => {
    const { id_post } = data.params
    const { id_user } = data.user

    const [postResult] = await getPostByPostId(id_post)

    if (postResult[0].id_user !== id_user) {
        throw new ErrorResponse(401, 'you are not authorized to delete this post')
    }
    if (postResult.length === 0) {
        throw new ErrorResponse(404, 'post not found')
    }
    
    const query = 'DELETE FROM posts WHERE id_post = ?'
    return await dbPool.execute(query, [id_post])
}