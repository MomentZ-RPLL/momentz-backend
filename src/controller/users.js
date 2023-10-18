const UserModels = require('../models/users')

exports.getAllUsers = async (req, res) => {
    try {
        const [data] = await UserModels.getAllUsers()

        res.status(200).json({
            status: '200',
            message: 'Get all users success',
        })
    } catch (error) {
        res.status(500).json({
            status: '500',
            message: 'Server Error',
        })
    }
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
            message: 'Server Error',
        })
    }
}