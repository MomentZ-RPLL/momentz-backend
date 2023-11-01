require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const UserModels = require('../models/users')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')

exports.registerUser = async (req, res) => {
    try {
        const [result] = await UserModels.registerUser(req)

        res.status(200).json({
            status: '200',
            message: 'Register user success',
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

exports.loginUser = async (req, res) => {
    try {
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
            throw new ErrorResponse(401, 'Invalid username or password')
        }
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

function generateToken(user) {
    const payload = { username: user.username, id_user: user.id_user }
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
            throw new ErrorResponse(404, 'User not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Get user success',
            data: result
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

exports.updateUser = async (req, res) => {
    try {
        const [result] = await UserModels.updateUser(req)
        if (result.affectedRows === 0) {
            throw new ErrorResponse(404, 'User not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Update user success',
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

exports.getComment = async (req, res) => {
    try {
        const [data] = await UserModels.getComment(req.params.id_post)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Comment not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess get Comments',
            data: data
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

exports.addComment = async (req, res) => {
    try {
        const id_post = req.params.id_post
        const comment = req.body.comment
        const id_user = req.user.id_user

        const [data] = await UserModels.addComment(id_post, comment, id_user)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Add comment failed')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess add Comment',
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

exports.getLikes = async (req, res) => {
    try {
        const [data] = await UserModels.getLikes(req.params.id_post)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Likes not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess get Likes',
            data: data
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}

exports.addLikes = async (req, res) => {
    try {
        const id_post = req.params.id_post
        const id_user = req.user.id_user

        const [data] = await UserModels.addLikes(id_post, id_user)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Add Likes failed')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess add Like',
        })
    } catch (error) {
        if (error instanceof ErrorResponse) {
            res.status(error.statusCode).json({
                status: error.statusCode.toString(),
                message: error.message,
            })
        } else {
            res.status(500).json({
                status: '500',
                message: `${error.message}`,
            })
        }
    }
}
