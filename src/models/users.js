const dbPool = require('../config/database')


const getAllUsers = async (username) => {
    const query = 'select * from users where username = ?'

    return dbPool.execute(query, [username])
}

exports.registerUser = async (data) => {
    try {
        const [row] = await getAllUsers(data.username)

        if (row.length > 0) {
            throw new Error('Username already exist')
        } else {
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
    } catch (error) {
        throw new Error(error)
    }
}