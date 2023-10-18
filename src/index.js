require('dotenv').config()
const PORT = process.env.PORT || 5000;

const express = require('express');

const app = express();

const usersRoutes = require('./routes/users');

const middlewareLogRequest = require('./middleware/logs');

app.use(middlewareLogRequest.logRequest);
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
});