const dbPool = require('../config/database')

exports.getUserByUsername = async (username) => {
  const query = 'select * from users where username = ?'

  return dbPool.execute(query, [username])
}

exports.getUserByEmail = async (email) => {
  const query = 'select * from users where email = ?'

  return dbPool.execute(query, [email])
}