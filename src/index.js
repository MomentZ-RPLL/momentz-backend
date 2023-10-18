require('dotenv').config()

const PORT = process.env.PORT || 3001

const express = require('express')
const usersRoutes = require('./routes/users')
const bodyParser = require('body-parser')
const middlewareLogRequest = require('./middleware/logs')

const app = express()

app.use(middlewareLogRequest.logRequest)
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));

app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
})