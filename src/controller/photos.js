require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const photoModels = require('../models/photos')
const jwt = require('jsonwebtoken')

exports.postMedia = async (req, res) => {
    try {
        const [result] = await photoModels.postMedia(req)
        
        res.status(200).json({
            status: '200',
            message: 'post success',
        })
    } catch (error) {
        res.status(500).json({
            status: '500',
            message: `${error.message}`,
        })
    }
}