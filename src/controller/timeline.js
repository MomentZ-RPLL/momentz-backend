require("dotenv").config()
const secretKey = process.env.JWT_SECRET_KEY

const TimelineModels = require("../models/timeline.js")
const jwt = require("jsonwebtoken")
const ErrorResponse = require("../utils/errorResponse")

exports.getTimeline = async (req, res) => {
  try {
    const [data] = await TimelineModels.getTimeline(req.user.id_user)
    if (data.length === 0) {
      throw new ErrorResponse(404, "Timeline not found")
    }

    const postMediaMap = new Map()

    const formattedData = data.map((row) => {
      const { username, profile_picture, post_media, caption, created_at, comment, id_post, like_count } = row

      const key = `${id_post}_${created_at}`

      if (!postMediaMap.has(key)) {
        postMediaMap.set(key, {
          username,
          profile_picture,
          postmedia: post_media,
          caption,
          created_at,
          comments: [],
          like_count,
        })
      }

      if (comment !== null) {
        postMediaMap.get(key).comments.push({
          comment,
          date: row.comment_created_at,
        })
      }

      return null
    })

    const result = Array.from(postMediaMap.values())

    res.status(200).json({
      status: "200",
      message: "Success get Timeline",
      data: result,
    })
  } catch (error) {
    if (error instanceof ErrorResponse) {
      res.status(error.statusCode).json({
        status: error.statusCode.toString(),
        message: error.message,
      })
    } else {
      res.status(500).json({
        status: "500",
        message: `${error.message}`,
      })
    }
  }
}