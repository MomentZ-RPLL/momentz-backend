const dbPool = require('../config/database')
const { sha256 } = require('js-sha256')

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
            data.created_at = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`

            const query = `insert into users (username, password, name, email, bio, profile_picture, created_at) values (?, ?, ?, ?, ?, ?, ?)`

            // encrypt password using sha256
            data.password = sha256(data.password)

            return dbPool.execute(query, [data.username, data.password, data.name, data.email, data.bio, data.profile_picture, data.created_at])
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.loginUser = async (data) => {
    const username = data.username
    const password = sha256(data.password)

    if (!username || !password) {
        console.log('Username and password are required')
        return false
    }

    const query = 'SELECT * FROM users WHERE username = ?'
    const [rows] = await dbPool.execute(query, [username])

    if (rows.length === 0) {
        console.log('Username not found')
        return false
    }

    const user = rows[0]
    if (user.password !== password) {
        console.log('Incorrect password')
        return false
    }

    return user
}