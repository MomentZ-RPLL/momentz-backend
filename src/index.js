require('dotenv').config()
const bodyParser = require('body-parser')
const middlewareLogRequest = require('./middleware/logs')

const usersRoutes = require('./routes/users')
const postsRoutes = require('./routes/posts')
const notificationRoutes = require('./routes/notification')

const PORT = process.env.PORT || 3001
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')


app.use(middlewareLogRequest.logRequest)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use("/images/profile_pictures", express.static("images/profile_pictures"))
app.use("/images/posts", express.static("images/posts"))

app.use('/users', usersRoutes)
app.use('/posts', postsRoutes)
app.use('/notification', notificationRoutes)

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
})