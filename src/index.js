require('dotenv').config()
const bodyParser = require('body-parser')
const middlewareLogRequest = require('./middleware/logs')

const usersRoutes = require('./routes/users')

const PORT = process.env.PORT || 3001
const express = require('express')
const app = express()


app.use(middlewareLogRequest.logRequest)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', usersRoutes)

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
})