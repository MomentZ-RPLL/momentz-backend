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
    if (data.body.lat === undefined) {
        data.body.lat = null
    }
    if (data.body.lon === undefined) {
        data.body.lon = null
    }

    const created_at = getDate()

    const query = `INSERT INTO posts SET ?`
    const value = {
        id_user: data.user.id_user,
        caption: data.body.caption,
        post_media: data.file.filename,
        created_at: created_at,
        lat: data.body.lat,
        lon: data.body.lon
    }
    return await dbPool.query(query, value)
}

exports.getMedia = async (id_post) => {
    const postQuery = `select 
    id_post, id_user, CONCAT("${process.env.POST_PATH}",post_media) as post_media, caption, created_at, lat, lon
    from posts where id_post = ?`
    const [postResult] = await dbPool.execute(postQuery, [id_post])

    if (postResult.length === 0) {
        throw new ErrorResponse(404, 'post not found')
    }

    const likeQuery = `SELECT  l.id_like, l.id_post, l.id_user, u.username, CONCAT("${process.env.PROFILE_PATH}",u.profile_picture) as profile_picture, l.created_at, l.is_notified FROM post_likes l join users u on l.id_user = u.id_user WHERE id_post = ?`
    const commentQuery = `SELECT c.id_comment, c.id_post, c.id_user, u.username, CONCAT("${process.env.PROFILE_PATH}",u.profile_picture) as profile_picture, c.comment, c.created_at, c.is_notified FROM post_comments c join users u on c.id_user = u.id_user WHERE id_post = ?`

    const [commentResult] = await dbPool.execute(commentQuery, [id_post])
    const [likeResult] = await dbPool.execute(likeQuery, [id_post])

    const post = {
        id_post: postResult[0].id_post,
        id_user: postResult[0].id_user,
        caption: postResult[0].caption,
        post_media: postResult[0].post_media,
        created_at: postResult[0].created_at,
        lat: postResult[0].lat,
        lon: postResult[0].lon,
        likes: likeResult,
        comments: commentResult
    }
    return post
}

exports.deleteMedia = async (data) => {
    const { id_post } = data.params
    const { id_user } = data.user

    const [postResult] = await getPostByPostId(id_post)

    if (postResult.length === 0) {
        throw new ErrorResponse(404, 'post not found')
    } else {
        if (postResult[0].id_user !== id_user) {
            throw new ErrorResponse(401, 'you are not authorized to delete this post')
        }
    }
    if (postResult.length === 0) {
        throw new ErrorResponse(404, 'post not found')
    }

    const query = 'DELETE FROM posts WHERE id_post = ?'
    return await dbPool.execute(query, [id_post])
}

exports.getComment = async (id_post) => {
    const query = 'SELECT * FROM post_comments WHERE id_post= ?'
    const data = await dbPool.query(query, [id_post])

    return data
}

exports.addComment = async (id_post, comment, id_user) => {
    const query = 'INSERT INTO post_comments (id_post, id_user, comment, created_at, is_notified) VALUES (?,?,?,?,?)'
    return await dbPool.query(query, [id_post, id_user, comment, getDate(), 1])
}

exports.getLikes = async (id_post) => {
    const query = 'SELECT count(id_post) AS Likes FROM post_likes WHERE id_post= ?'
    const data = await dbPool.query(query, [id_post])
    return data
}

exports.deleteComments = async (id_post, id_user, id_comment) => {
    try {
        const checkQuery = 'SELECT COUNT(comment) as commentCount FROM post_comments WHERE id_comment= ?'
        const checkResult = await dbPool.query(checkQuery, [id_comment])

        const commentCount = checkResult[0][0].commentCount
        if (commentCount === 1) {
            const insertQuery = 'DELETE FROM post_comments WHERE id_post = ? AND id_user = ? AND id_comment= ?'
            await dbPool.query(insertQuery, [id_post, id_user, id_comment])
            return true
        } else {
            return false
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.addLikes = async (id_post, id_user) => {
    const checkQuery = 'SELECT COUNT(*) AS likeCount FROM post_likes WHERE id_post = ? AND id_user = ?'
    const checkResult = await dbPool.query(checkQuery, [id_post, id_user])

    const likeCount = checkResult[0][0].likeCount

    if (likeCount === 0) {
        const insertQuery = 'INSERT INTO post_likes (id_post, id_user, created_at, is_notified) VALUES (?,?,?,?)'
        await dbPool.query(insertQuery, [id_post, id_user, getDate(), 1])
        return true
    } else {
        return false
    }
}

exports.unLikes = async (id_post, id_user) => {
    const checkQuery = 'SELECT COUNT(*) AS likeCount FROM post_likes WHERE id_post = ? AND id_user = ?'
    const checkResult = await dbPool.query(checkQuery, [id_post, id_user])

    const likeCount = checkResult[0][0].likeCount

    if (likeCount === 1) {
        const insertQuery = 'DELETE FROM post_likes WHERE id_post = ? AND id_user = ?'
        await dbPool.query(insertQuery, [id_post, id_user])
        return true
    } else {
        throw new ErrorResponse(400, 'Post is already unliked')
    }
}