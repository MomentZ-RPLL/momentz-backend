const dbPool = require("../config/database")
const { getDate } = require('../utils/mediaUtils')
const ErrorResponse = require("../utils/errorResponse")

exports.getAllChat = async (id_user) => {
  const query =
    `SELECT 
    CASE 
      WHEN u1.id_user = ? THEN u2.username
      ELSE u1.username
    END AS other_username,
    CASE 
      WHEN u1.id_user = ? THEN CONCAT("${process.env.PROFILE_PATH}", u2.profile_picture)
      ELSE CONCAT("${process.env.PROFILE_PATH}", u1.profile_picture)
    END AS other_profile_picture, 
    c.id_sender, c.id_receiver, c.message, c.sent_at, c.is_read
    FROM chat c
      JOIN users u1 ON c.id_sender = u1.id_user
      JOIN users u2 ON c.id_receiver = u2.id_user
    WHERE (c.id_sender = ? OR c.id_receiver = ?)
    AND c.sent_at = (
        SELECT MAX(sent_at)
        FROM chat
        WHERE (id_sender = c.id_sender AND id_receiver = c.id_receiver)
        OR (id_sender = c.id_receiver AND id_receiver = c.id_sender)
    )
    ORDER BY c.sent_at DESC
  `
  return await dbPool.query(query, [id_user, id_user, id_user, id_user])
}

exports.getDetailChat = async (id_sender, id_receiver) => {
  const query =
    `SELECT
    c.id_chat, 
    c.id_sender, CONCAT("${process.env.PROFILE_PATH}", u1.profile_picture) as sender_profile_picture, u1.username as sender_username,
    c.id_receiver, CONCAT("${process.env.PROFILE_PATH}", u2.profile_picture) as receiver_profile_picture, u2.username as receiver_username,
    c.message, c.sent_at, c.is_read
  FROM chat c
    JOIN users u1 ON c.id_sender = u1.id_user
    JOIN users u2 ON c.id_receiver = u2.id_user
  WHERE (c.id_sender = ? AND c.id_receiver = ?) OR (c.id_sender = ? AND c.id_receiver = ?)
  ORDER BY c.sent_at DESC
  `
  const data = await dbPool.query(query, [id_sender, id_receiver, id_receiver, id_sender])

  if (data.length !== 0) {
    const updateQuery =
      `UPDATE chat SET is_read = 1 WHERE id_sender = ? AND id_receiver = ?`
    await dbPool.query(updateQuery, [id_receiver, id_sender])
  }
  return data
}

exports.postChat = async (id_sender, id_receiver, message) => {
  if (id_sender == id_receiver) {
    throw new ErrorResponse(400, 'You can\'t chat with yourself')
  }
  
  const user = `SELECT * FROM users WHERE id_user = ?`
  const [userCheck] = await dbPool.query(user, [id_receiver])
  if (userCheck.length === 0) {
    throw new ErrorResponse(404, 'User not found')
  }

  const query = `INSERT INTO chat SET ?`
  const values = {
    id_sender: id_sender,
    id_receiver: id_receiver,
    message: message,
    sent_at: getDate(),
    is_read: 0
  }
  return await dbPool.query(query, [values])
}