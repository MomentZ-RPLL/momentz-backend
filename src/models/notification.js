const dbPool = require('../config/database')
const ErrorResponse = require('../utils/errorResponse')

exports.getNotifComment = async (id_post) => {
    const query = 'SELECT count(is_notified) AS CommentNotification FROM post_comments WHERE id_post= ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_post, 1])

    return data
}

exports.getNotifLikes = async (id_post) => {
    const query = 'SELECT count(is_notified) AS LikesNotification FROM post_likes WHERE id_post= ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_post, 1])

    return data
}

exports.getNotifFollow = async (id_user) => {
    const query = 'SELECT count(is_notified) AS LikesNotification FROM post_likes WHERE id_post= ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_post, 1])

    return data
}