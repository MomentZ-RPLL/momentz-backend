const UserModels = require('../models/users');

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

module.exports = {
    getAllUsers,
}