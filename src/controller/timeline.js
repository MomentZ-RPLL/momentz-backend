require("dotenv").config()
const secretKey = process.env.JWT_SECRET_KEY

const TimelineModels = require("../models/timeline.js")
const jwt = require("jsonwebtoken")
const ErrorResponse = require("../utils/errorResponse")

exports.getTimeline = async (req, res) => {
  try {
    const [data] = await TimelineModels.getTimeline(req.user.id_user)
    if (data.length === 0) {
      throw new ErrorResponse(200, "Timeline is empty")
    }

    const postMediaMap = new Map()

    data.map((row) => {
      const { username, profile_picture, id_post, post_media, caption, created_at, lat, lon, like_count } = row

      const key = id_post

      if (!postMediaMap.has(key)) {
        postMediaMap.set(key, {
          username,
          profile_picture,
          id_post,
          post_media,
          caption,
          created_at,
          lat,
          lon,
          like_count,
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