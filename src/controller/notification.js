require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const NotifModels = require('../models/notification')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')


exports.getNotifComment = async (req, res) => {
    try {
        const [data] = await NotifModels.getNotifComment(req.params.id_post, req.user.id_user)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Notif not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess get Notification',
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

exports.getNotifLikes = async (req, res) => {
    try {
        const [data] = await NotifModels.getNotifLikes(req.params.id_post, req.user.id_user)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Notif not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess get Notification',
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

exports.getNotifFollow = async (req, res) => {
    try {
        const id_user = req.user.id_user
        const [data] = await NotifModels.getNotifFollow(id_user)
        if (data.length === 0) {
            throw new ErrorResponse(404, 'Notif not found')
        }
        res.status(200).json({
            status: '200',
            message: 'Sucess get Notification',
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