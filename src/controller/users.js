require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const UserModels = require('../models/users')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try {
        const [result] = await UserModels.registerUser(req)

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
    const data = req.body
    const user = await UserModels.loginUser(data)
    if (user) {
        const token = generateToken(user)
        res.cookie('token', token, { maxAge: 2630000, httpOnly: true })
        res.status(200).json({
            status: '200',
            message: 'Login user success',
            data: {
                token: token,
                user: user
            }
        })
    } else {
        res.status(401).json({ message: 'Invalid username or password' })
    }
}

function generateToken(user) {
    const payload = { username: user.username }
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })
    return token
}

exports.logoutUser = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        status: '200',
        message: 'Logout user success',
    })
}

exports.getUser = async (req, res) => {
    try {
        const [result] = await UserModels.getUser(req.params.username)
        if (result.length === 0) {
            res.status(404).json({
                status: '404',
                message: 'User not found',
            })
        } else {
            res.status(200).json({
                status: '200',
                message: 'Get user success',
                data: result[0]
            })
        }
    } catch (error) {
        res.status(500).json({
            status: '500',
            message: `${error.message}`,
        })
    }
}