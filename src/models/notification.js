const dbPool = require('../config/database')
const ErrorResponse = require('../utils/errorResponse')

exports.getNotifComment = async (id_post, id_user) => {
    const query ='SELECT u.username, p.comment, po.id_post, p.created_at FROM post_comments p JOIN users u ON u.id_user = p.id_user JOIN posts po ON po.id_post = p.id_post  WHERE p.id_post = ? AND p.is_notified = ? and po.id_user = ?'
    const data = await dbPool.query(query, [id_post, 1, id_user])
    if (data[0].length !== 0) {
    const updateQuery = 'UPDATE post_comments SET is_notified = ? WHERE id_post = ?';
    await dbPool.query(updateQuery, [0, id_post]);
    }
    return data
}

exports.getNotifLikes = async (id_post, id_user) => {
    const query = 'SELECT u.username, p.id_post, p.created_at FROM post_likes p JOIN users u ON u.id_user = p.id_user JOIN posts po ON po.id_post = p.id_post  WHERE p.id_post = ? AND p.is_notified = ? and po.id_user = ?'
    const data = await dbPool.query(query, [id_post, 1, id_user])
    if (data[0].length !== 0) {
        const updateQuery = 'UPDATE post_likes SET is_notified = ? WHERE id_post = ?';
        await dbPool.query(updateQuery, [0, id_post]);
    }
    return data
}

exports.getNotifFollow = async (id_user) => {
    const query = 'SELECT u.username, uf.followed_at FROM user_follow uf JOIN users u ON u.id_user = uf.id_user WHERE uf.id_following = ? AND is_notified= ?'
    const data = await dbPool.query(query, [id_user, 1])
    if (data[0].length !== 0) {
    const updateQuery = 'UPDATE user_follow SET is_notified = ? WHERE id_following = ?';
    await dbPool.query(updateQuery, [0, id_user]);
    }
    return data
}