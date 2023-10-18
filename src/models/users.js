const dbPool = require('../config/database')


exports.getAllUsers = () => {
    const query = 'select * from users'

    return dbPool.execute(query)
}

exports.registerUser = (data) => {
    if (data.bio === undefined) {
        data.bio = null
    }
    if (data.profile_picture === undefined) {
        data.profile_picture = null
    }
    data.created_at = `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    const query = `insert into users (username, password, name, email, bio, profile_picture, created_at) values (?, ?, ?, ?, ?, ?, ?)`

    return dbPool.execute(query, [data.username, data.password, data.name, data.email, data.bio, data.profile_picture, data.created_at])
}