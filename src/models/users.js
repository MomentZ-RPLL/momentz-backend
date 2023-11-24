const dbPool = require('../config/database')
const { sha256 } = require('js-sha256')
const { getUserByUsername, getUserByEmail } = require('../utils/userUtils')
const ErrorResponse = require('../utils/errorResponse')
const { getDate } = require('../utils/mediaUtils')

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
            users.id_user, users.username, users.password, users.name, users.email, users.bio, CONCAT("${process.env.PROFILE_PATH}",users.profile_picture) as profile_picture, users.created_at,
            (SELECT COUNT(*) FROM user_follow WHERE id_following = users.id_user) AS followers_count,
            (SELECT COUNT(*) FROM user_follow WHERE id_user = users.id_user) AS following_count
        FROM 
            users
        WHERE 
            users.username = ?`

    const postsQuery =
        `SELECT id_post, id_user, CONCAT("${process.env.POST_PATH}",post_media) as post_media, caption, created_at, lat, lon
        FROM 
            posts
        WHERE 
            id_user = (SELECT id_user FROM users WHERE username = ?)`

    const [userData] = await dbPool.execute(userQuery, [username])
    const [postsData] = await dbPool.execute(postsQuery, [username])

    if (userData.length === 0) {
        throw new ErrorResponse(404, 'User not found')
    }

    const user = {
        id_user: userData[0].id_user,
        username: userData[0].username,
        password: userData[0].password,
        name: userData[0].name,
        email: userData[0].email,
        bio: userData[0].bio,
        profile_picture: userData[0].profile_picture,
        created_at: userData[0].created_at,
        followers_count: userData[0].followers_count,
        following_count: userData[0].following_count,
        posts: postsData
    }

    return [user]
}

exports.updateUser = async (req) => {
    if (req.params.username !== req.user.username) {
        throw new ErrorResponse(401, 'You are not authorized to update this user')
    }

    const userQuery = 'SELECT * FROM users WHERE username = ?'
    const [userData] = await dbPool.execute(userQuery, [req.params.username])

    if (userData.length === 0) {
        throw new ErrorResponse(404, 'User not found')
    }

    const user = userData[0]

    const name = req.body.name || user.name
    const email = req.body.email || user.email
    const bio = req.body.bio || user.bio
    const profile_picture = req.query != null && req.query.del_pict === 'true' ? 'default.png' : (req.file !== undefined ? req.file.filename : user.profile_picture)

    const query = 'UPDATE users SET name = ?, email = ?, bio = ?, profile_picture = ? WHERE username = ?'
    const values = [name, email, bio, profile_picture, req.params.username]

    return await dbPool.query(query, values)
}

exports.followUser = async (id_user, id_following) => {
    
    const user = `select * from user_follow where id_user = ${id_user} and id_following = ${id_following}`
    const [userCheck] = await dbPool.query(user)
    if (userCheck.length > 0) {
        throw new ErrorResponse(400, 'You already follow this user')
    }
    
    const date = getDate()
    const query = `insert into user_follow set ?`
    const value = {
        id_user: id_user,
        id_following: id_following,
        followed_at: date,
        is_notified: 1
    }
    const data = await dbPool.query(query, value)

    if (data.affectedRows === 0) {
        throw new ErrorResponse(400, 'Failed to follow user')
    } else {
        return data
    }
}

exports.getFollowers = async (id_user) => {
    const query = `
    SELECT
        users.id_user, users.username, CONCAT("${process.env.PROFILE_PATH}",users.profile_picture) as profile_picture, user_follow.followed_at as following_since
    from
        user_follow
    join users on
        user_follow.id_user = users.id_user
    where user_follow.id_following = ?`
    const data = await dbPool.query(query, [id_user])

    return data
}

exports.getFollowing = async (id_user) => {
    const query = `
    SELECT
        users.id_user, users.username, CONCAT("${process.env.PROFILE_PATH}",users.profile_picture) as profile_picture, user_follow.followed_at as following_since
    from
        user_follow
    join users on
        user_follow.id_following = users.id_user
    where user_follow.id_user = ?`
    const data = await dbPool.query(query, [id_user])

    return data
}

exports.removeFollow = async (id_user, id_following) => {
    const query = `delete from user_follow where id_user = ? and id_following = ?`
    const value = [id_user, id_following]

    return await dbPool.query(query, value)
}

exports.searchUser = async (username) => {
    const query = `
    SELECT
        id_user, username, CONCAT("${process.env.PROFILE_PATH}",profile_picture) as profile_picture
    from
        users
    where username like ?`
    const value = `%${username}%`
    return await dbPool.query(query, [value])
}