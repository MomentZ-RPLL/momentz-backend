const UserModels = require('../models/users')

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