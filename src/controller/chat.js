require('dotenv').config()

const chatModels = require('../models/chat')
const ErrorResponse = require('../utils/errorResponse')

exports.getAllChat = async (req, res) => {
  try {
    const id_user = req.user.id_user
    const [data] = await chatModels.getAllChat(id_user)
    if (data.length === 0) {
      throw new ErrorResponse(404, 'Chat not found')
    }
    res.status(200).json({
      status: '200',
      message: 'Sucess get Chat',
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

exports.getDetailChat = async (req, res) => {
  try {
    const id_sender = req.user.id_user
    const id_receiver = req.params.id_user
    if (id_sender == id_receiver) {
      throw new ErrorResponse(400, 'You can\'t chat with yourself')
    }
    
    const [data] = await chatModels.getDetailChat(id_sender, id_receiver)
    if (data.length === 0) {
      throw new ErrorResponse(404, 'Chat not found')
    }
    
    res.status(200).json({
      status: '200',
      message: 'Sucess get Chat',
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

exports.postChat = async (req, res) => {
  try {
    const id_sender = req.user.id_user
    const id_receiver = req.params.id_user
    const { message } = req.body
    await chatModels.postChat(id_sender, id_receiver, message)
    res.status(200).json({
      status: '200',
      message: 'Sucess post Chat'
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