const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        // Jika verifikasi berhasil, Anda dapat menyimpan data pengguna dalam objek req.user atau sesuai dengan kebutuhan Anda.
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;