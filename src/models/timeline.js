const dbPool = require("../config/database")

exports.getTimeline = async (id_user) => {
  const query =
    `SELECT 
      u.username,
      CONCAT("${process.env.PROFILE_PATH}", u.profile_picture) as profile_picture,
      p.id_post,
      CONCAT("${process.env.POST_PATH}", p.post_media) as post_media,
      p.caption,
      p.created_at,
      p.lat, 
      p.lon,
      COUNT(pl.id_post) AS like_count
    FROM user_follow uf
      JOIN posts p ON (uf.id_following = p.id_user OR uf.id_user = p.id_user)
      JOIN users u ON u.id_user = p.id_user
      LEFT JOIN post_likes pl ON p.id_post = pl.id_post
    WHERE uf.id_user = ?
    GROUP BY
      p.id_post
    ORDER BY
      p.created_at DESC;`

  const data = await dbPool.query(query, [id_user])
  return data
}
