require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const photoModels = require('../models/photos')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')

exports.postMedia = async (req, res) => {
    try {
        const [result] = await photoModels.postMedia(req)
        if (result.affectedRows === 0) {
            throw new ErrorResponse(400, 'post failed')
        }

        res.status(200).json({
            status: '200',
            message: 'post success',
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

exports.getMedia = async (req, res) => {
    try {
        if (req.params.id_post === undefined) {
            throw new ErrorResponse(400, 'id post is required')
        }

        const result = await photoModels.getMedia(req.params.id_post)
        if (result.length === 0) {
            throw new ErrorResponse(400, 'failed to get data')
        }
        res.status(200).json({
            status: '200',
            message: 'success',
            data: result
        })
    } catch (error) {
        console.trace(error)
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

exports.deleteMedia = async (req, res) => {
    try {
        const [result] = await photoModels.deleteMedia(req)
        if (result.affectedRows === 0) {
            throw new ErrorResponse(400, 'delete failed')
        }
        res.status(200).json({
            status: '200',
            message: 'delete success',
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