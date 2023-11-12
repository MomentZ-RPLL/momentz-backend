require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

const postModels = require('../models/posts')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')

exports.postMedia = async (req, res) => {
    try {
        const [result] = await postModels.postMedia(req)
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

        const result = await postModels.getMedia(req.params.id_post)
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
        const [result] = await postModels.deleteMedia(req)
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

exports.getComment = async (req, res) => {
    try {
        const [data] = await postModels.getComment(req.params.id_post)
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

        const [data] = await postModels.addComment(id_post, comment, id_user)
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

exports.deleteComments = async (req, res) => {
    try {
        const id_post = req.params.id_post
        const id_user = req.user.id_user
        const id_comment = req.body.id_comments

        const data = await postModels.deleteComments(id_post, id_user, id_comment)
        if (!data) {
            res.status(200).json({
                status: '200',
                message: 'No Comment Found',
            })
        } else {
            res.status(200).json({
                status: '200',
                message: 'Success delete Comments',
            })
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

exports.getLikes = async (req, res) => {
    try {
        const [data] = await postModels.getLikes(req.params.id_post)
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

        const data = await postModels.addLikes(id_post, id_user)
        if (!data) {
            console.log('asd')
            res.status(200).json({
                status: '200',
                message: 'Post is already liked',
            })
        } else {
            res.status(200).json({
                status: '200',
                message: 'Success add Like',
            })
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

exports.unLikes = async (req, res) => {
    try {
        const id_post = req.params.id_post
        const id_user = req.user.id_user

        const data = await postModels.unLikes(id_post, id_user)
        if (!data) {
            throw new ErrorResponse(404, 'Failed, Like First')
        } else {
            res.status(200).json({
                status: '200',
                message: 'Success unlikes',
            })
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