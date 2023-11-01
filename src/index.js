require('dotenv').config()
const bodyParser = require('body-parser')
const middlewareLogRequest = require('./middleware/logs')

const usersRoutes = require('./routes/users')
const photosRoutes = require('./routes/photos')

const PORT = process.env.PORT || 3001
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')


app.use(middlewareLogRequest.logRequest)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/user', usersRoutes)
app.use('/photos', photosRoutes)

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
})