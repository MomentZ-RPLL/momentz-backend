const dbPool = require("../config/database");
const ErrorResponse = require("../utils/errorResponse");

exports.getNotifComment = async (id_user) => {

  const query = `
  SELECT pc.id_comment, u.username, CONCAT("${process.env.PROFILE_PATH}",u.profile_picture) as profile_picture, pc.comment, p.id_post, CONCAT("${process.env.POST_PATH}", p.post_media) as post_media, pc.created_at
  FROM posts p
    JOIN post_comments pc ON p.id_post = pc.id_Post
    JOIN users u ON pc.id_user = u.id_user
  WHERE p.id_user = ? AND pc.is_notified = 1
  `
  const data = await dbPool.query(query, [id_user])

  // if (data[0].length !== 0) {
  //   const updateQuery = `
  //     UPDATE post_comments 
  //     SET is_notified = 0 
  //     WHERE id_post IN (SELECT id_post FROM posts WHERE id_user = ?) AND is_notified = 1
  //   `
  //   await dbPool.query(updateQuery, [id_user])
  // }
  return data
}

exports.getNotifLikes = async (id_user) => {
  const query = `
  SELECT pl.id_like, p.id_post, u.username, CONCAT("${process.env.PROFILE_PATH}",u.profile_picture) as profile_picture, CONCAT("${process.env.POST_PATH}", p.post_media) as post_media, pl.created_at
  FROM posts p
    JOIN post_likes pl ON p.id_post = pl.id_post
    JOIN users u ON pl.id_user = u.id_user
  WHERE p.id_user = ? AND pl.is_notified = 1
  `
  const data = await dbPool.query(query, [id_user])

  if (data[0].length !== 0) {
    const updateQuery = `
      UPDATE post_likes
      SET is_notified = 0 
      WHERE id_post IN (SELECT id_post FROM posts WHERE id_user = ?) AND is_notified = 1
    `
    await dbPool.query(updateQuery, [id_user])
  }
  return data
}

exports.getNotifFollow = async (id_user) => {
  const query =
    `SELECT u.username, uf.id_user, CONCAT("${process.env.PROFILE_PATH}", u.profile_picture) as profile_picture, uf.followed_at FROM user_follow uf JOIN users u ON u.id_user = uf.id_user WHERE uf.id_following = ? AND is_notified= ?`
  const data = await dbPool.query(query, [id_user, 1])

  // if (data[0].length !== 0) {
  //   const updateQuery =
  //     "UPDATE user_follow SET is_notified = ? WHERE id_following = ?"
  //   await dbPool.query(updateQuery, [0, id_user])
  // }
  return data
}
