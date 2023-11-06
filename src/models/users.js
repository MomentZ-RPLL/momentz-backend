const dbPool = require('../config/database')
const { sha256 } = require('js-sha256')
const { getUserByUsername, getUserByEmail } = require('../utils/userUtils')
const ErrorResponse = require('../utils/errorResponse')
const { getProfilePictureURL } = require('../utils/mediaUtils')

exports.registerUser = async (data) => {
    if (data.body.username === undefined) {
        throw new ErrorResponse(400, 'username is required')
    }
    if (data.body.password === undefined) {
        throw new ErrorResponse(400, 'password is required')
    }
    if (data.body.name === undefined) {
        throw new ErrorResponse(400, 'name is required')
    }
    if (data.body.email === undefined) {
        throw new ErrorResponse(400, 'email is required')
    }
    if (data.body.bio === undefined) {
        data.body.bio = null
    }
    if (data.file === undefined) {
        data.file = { filename: 'default.png' }
    }
    if (data.body.created_at === undefined) {
        data.body.created_at = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    }

    const [username] = await getUserByUsername(data.body.username)
    if (username.length > 0) {
        throw new ErrorResponse(400, 'a user with that username already exist')
    }
    const [email] = await getUserByEmail(data.body.email)
    if (email.length > 0) {
        throw new ErrorResponse(400, 'a user with that email already exist')
    }

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
}

exports.loginUser = async (data) => {
    const username = data.username
    const password = sha256(data.password)

    if (!username || !password) {
        console.log('Username and password are required')
        throw new ErrorResponse(400, 'Username and password are required')
    }

    const query = 'SELECT * FROM users WHERE username = ?'
    const [rows] = await dbPool.execute(query, [username])

    if (rows.length === 0) {
        console.log('Username not found')
        throw new ErrorResponse(404, 'Username not found')
    }

    const user = rows[0]
    if (user.password !== password) {
        console.log('Incorrect password')
        throw new ErrorResponse(401, 'Incorrect password')
    }

    return user
}

exports.getUser = async (username) => {
    const userQuery =
        `SELECT 
            *,
            (SELECT COUNT(*) FROM user_follow WHERE id_following = users.id_user) AS followers_count,
            (SELECT COUNT(*) FROM user_follow WHERE id_user = users.id_user) AS following_count
        FROM 
            users
        WHERE 
            users.username = ?`

    const postsQuery =
        `SELECT id_post, id_user, CONCAT("${process.env.DB_HOST}:${process.env.PORT}${process.env.POST_PATH}",post_media) as post_media, caption, created_at
        FROM 
            posts
        WHERE 
            id_user = (SELECT id_user FROM users WHERE username = ?)`

    const [userData] = await dbPool.execute(userQuery, [username])
    const [postsData] = await dbPool.execute(postsQuery, [username])

    if (userData.length === 0) {
        throw new ErrorResponse(404, 'User not found')
    }

    const profile_picture = getProfilePictureURL(userData[0].profile_picture)
    
    const user = {
        id_user: userData[0].id_user,
        username: userData[0].username,
        password: userData[0].password,
        name: userData[0].name,
        email: userData[0].email,
        bio: userData[0].bio,
        profile_picture: profile_picture,
        created_at: userData[0].created_at,
        followers_count: userData[0].followers_count,
        following_count: userData[0].following_count,
        posts: postsData
    }

    return [user]
}

exports.updateUser = async (data) => {
    if (data.params.username != data.user.username) {
        throw new ErrorResponse(401, 'you are not authorized to update this user')
    }
    
    if (data.body.name === undefined) {
        throw new ErrorResponse(400, 'name is required')
    }
    if (data.body.email === undefined) {
        throw new ErrorResponse(400, 'email is required')
    }
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
}

exports.getComment = async (id_post) => {
    const query = 'SELECT * FROM post_comments WHERE id_post= ?'
    const data = await dbPool.query(query, [id_post])

    return data
}

exports.addComment = async (id_post, comment, id_user) => {
    const query = 'INSERT INTO post_comments (id_post, id_user, comment, created_at) VALUES (?,?,?,?)'
    return await dbPool.query(query, [id_post, id_user, comment, new Date()])
}

exports.getLikes = async (id_post) => {
    const query = 'SELECT count(id_post) AS Likes FROM post_likes WHERE id_post= ?'
    const data = await dbPool.query(query, [id_post])
    return data
}

exports.deleteComments = async (id_post, id_user, id_comment) => {
    try {
        const checkQuery = 'SELECT COUNT(comment) as commentCount FROM post_comments WHERE id_comment= ?'
        const checkResult = await dbPool.query(checkQuery, [id_comment])

        const commentCount = checkResult[0][0].commentCount
        if (commentCount === 1) {
            const insertQuery = 'DELETE FROM post_comments WHERE id_post = ? AND id_user = ? AND id_comment= ?'
            await dbPool.query(insertQuery, [id_post, id_user, id_comment])
            return true
        } else {
            return false
        }
    } catch (error) {
        throw new Error(error)
    }
}

exports.addLikes = async (id_post, id_user) => {
    const checkQuery = 'SELECT COUNT(*) AS likeCount FROM post_likes WHERE id_post = ? AND id_user = ?'
    const checkResult = await dbPool.query(checkQuery, [id_post, id_user])

    const likeCount = checkResult[0][0].likeCount

    if (likeCount === 0) {
        const insertQuery = 'INSERT INTO post_likes (id_post, id_user, created_at) VALUES (?,?,?)'
        await dbPool.query(insertQuery, [id_post, id_user, new Date()])
        return true
    } else {
        throw new ErrorResponse(400, 'Post is already liked')
    }
}

exports.unLikes = async (id_post, id_user) => {
    const checkQuery = 'SELECT COUNT(*) AS likeCount FROM post_likes WHERE id_post = ? AND id_user = ?'
    const checkResult = await dbPool.query(checkQuery, [id_post, id_user])

    const likeCount = checkResult[0][0].likeCount

    if (likeCount === 1) {
        const insertQuery = 'DELETE FROM post_likes WHERE id_post = ? AND id_user = ?'
        await dbPool.query(insertQuery, [id_post, id_user])
        return true
    } else {
        throw new ErrorResponse(400, 'Post is already unliked')
    }
}