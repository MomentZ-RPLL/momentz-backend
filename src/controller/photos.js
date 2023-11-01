require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const photoModels = require('../models/photos')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')

exports.postMedia = async (req, res) => {
    try {
        const [result] = await photoModels.postMedia(req)
        
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