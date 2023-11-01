const dbPool = require('../config/database')
const { sha256 } = require('js-sha256')
const { getUserByUsername, getUserByEmail } = require('../utils/userUtils')
const multer = require('multer')

exports.registerUser = async (data) => {
    try {
        const [username] = await getUserByUsername(data.body.username)
        if (username.length > 0) {
            throw new Error('a user with that username already exist')
        }
        const [email] = await getUserByEmail(data.body.email)
        if (email.length > 0) {
            throw new Error('a user with that email already exist')
        }

        if (data.body.bio === undefined) {
            data.body.bio = null
        }

        if (data.file === undefined) {
            data.file = { filename: 'default.png' }
        }

        data.body.created_at = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`

        // encrypt password using sha256
        data.body.password = sha256(data.body.password)

        const query = `insert into users set ?`
        const value = {
            username: data.body.username,
            password: data.body.password,
            name: data.body.name,
            email: data.body.email,
            bio: data.body.bio,
            profile_picture: data.file.filename,
            created_at: data.body.created_at
        }
        return await dbPool.query(query, value)
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

exports.getUser = async (username) => {
    const query =
        `SELECT 
            users.*, 
            (SELECT COUNT(*) FROM user_follow WHERE id_following = users.id_user) AS followers_count,
            (SELECT COUNT(*) FROM user_follow WHERE id_user = users.id_user) AS following_count
        FROM 
            users
        WHERE 
            users.username = ?`

    return await dbPool.execute(query, [username])
}

exports.updateUser = async (data) => {
    try {
        if (data.body.bio === undefined) {
            data.body.bio = null
        }

        if (data.file === undefined) {
            data.file = { filename: 'default.png' }
        }

        const query = `update users set ? where username = ?`
        const value = {
            name: data.body.name,
            email: data.body.email,
            bio: data.body.bio,
            profile_picture: data.file.filename
        }
        return await dbPool.query(query, [value, data.params.username])
    } catch (error) {
        throw new Error(error)
    }
}