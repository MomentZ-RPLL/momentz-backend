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

exports.loginUser = async (data) => {
    const { username, password } = data;

    if (!username || !password) {
        console.log('Username and password are required');
        return false;
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await dbPool.execute(query, [username]);

    if (rows.length === 0) {
        console.log('Username not found');
        return false;
    }

    const user = rows[0];
    if (user.password !== password) {
        console.log('Incorrect password');
        return false;
    }

    return user;
};



