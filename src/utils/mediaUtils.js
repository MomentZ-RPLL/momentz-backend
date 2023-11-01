const dbPool = require('../config/database')

exports.getPostByUsername = async (username) => {
  const query = 'select * from posts where username = ?'

  return dbPool.execute(query, [username])
}

exports.getPostByPostId = async (id) => {
  const query = 'select * from posts where id_post = ?'

  return dbPool.execute(query, [id])
}