require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

const UserModels = require('../models/users')
const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = { username: user.username };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}

const getAllUsers = async (req, res) => {
    try {
        const [data] = await UserModels.getAllUsers();
    
        res.json({
            message: 'Get all user succes',
            data: data
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error
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