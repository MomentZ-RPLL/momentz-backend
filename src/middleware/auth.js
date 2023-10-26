const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

function authenticateToken(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ status: '401', message: 'no token provided' })
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: '403', message: 'Invalid token' })
        }
        // Jika verifikasi berhasil, Anda dapat menyimpan data pengguna dalam objek req.user atau sesuai dengan kebutuhan Anda.
        req.user = decoded
        next()
    })
}

module.exports = authenticateToken