const dbPool = require('../config/database')
const { sha256 } = require('js-sha256')
const { getUserByUsername, getUserByEmail } = require('../utils/userUtils')
const multer = require('multer')
const { use } = require('../routes/users')

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

exports.getComment = async (id_post) => {
    try {
        const query = 'SELECT * FROM post_comments WHERE id_post= ?';
        const data = await dbPool.query(query, [id_post]);

        return data;
      } catch (error) {
        throw new Error(error)
      }
}

exports.addComment = async (id_post, comment, id_user) => {
    try {
        const query = 'INSERT INTO post_comments (id_post, id_user, comment, created_at) VALUES (?,?,?,?)';
        return await dbPool.query(query, [id_post, id_user, comment, new Date()]);

      } catch (error) {
        throw new Error(error)
      }
}
  
  exports.getLikes = async (id_post) => {
    try {
        const query = 'SELECT count(id_post) AS Likes FROM post_likes WHERE id_post= ?';
        const data = await dbPool.query(query, [id_post]);

        return data;
      } catch (error) {
        throw new Error(error)
      }
}

// exports.addLikes = async (id_post, id_user) => {
//     try {
//       const checkQuery = 'SELECT * FROM post_likes WHERE id_post = ? AND id_user = ?';
//       const checkResult = await dbPool.query(checkQuery, [id_post, id_user]);
  
//       if (checkResult.length === 0) {
//         const insertQuery = 'INSERT INTO post_likes (id_post, id_user, created_at) VALUES (?,?,?)';
//         return await dbPool.query(insertQuery, [id_post, id_user, new Date()]);
//       } else {
//         return "User has already liked this post.";
//       }
//     } catch (error) {
//         throw new Error(error)
//     }
//   }
  