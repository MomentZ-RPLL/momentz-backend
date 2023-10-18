require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

const UserModels = require('../models/users')
const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = { username: user.username };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}


exports.registerUser = async (req, res) => {
    try {
        const data = req.body
        const [result] = await UserModels.registerUser(data)

        res.status(200).json({
            status: '200',
            message: 'Register user success',
        })
    } catch (error) {
        res.status(500).json({
            status: '500',
            message: `${error.message}`,
        })
    }
}

exports.loginUser = async (req, res) => {
        const data = req.body;
        const user = await UserModels.loginUser(data);
        if (user) {
            const token = generateToken(user);
            res.status(200).json({
                status: '200',
                message: 'Login user success',
                data: {
                    token: token,
                    user: user
                }
            })
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
}
