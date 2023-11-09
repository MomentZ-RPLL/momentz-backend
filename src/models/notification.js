const dbPool = require('../config/database')
const ErrorResponse = require('../utils/errorResponse')

exports.getNotifComment = async (id_post) => {
    const query = 'SELECT COUNT(is_notified) AS CommentNotification FROM post_comments WHERE id_post= ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_post, 1])
    const updateQuery = 'UPDATE post_comments SET is_notified = ? WHERE id_post = ?';
    await dbPool.query(updateQuery, [0, id_post]);

    return data
}

exports.getNotifLikes = async (id_post) => {
    const query = 'SELECT count(is_notified) AS LikesNotification FROM post_likes WHERE id_post= ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_post, 1])
    const updateQuery = 'UPDATE post_likes SET is_notified = ? WHERE id_post = ?';
    await dbPool.query(updateQuery, [0, id_post]);

    return data
}

exports.getNotifFollow = async (id_user) => {
    const query = 'SELECT count(is_notified) AS FollowNotification FROM user_follow WHERE id_user = ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_user, 1])
    const updateQuery = 'UPDATE user_follow SET is_notified = ? WHERE id_user = ?';
    await dbPool.query(updateQuery, [0, id_user]);

    return data
}