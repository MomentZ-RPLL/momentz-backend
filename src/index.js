const express = require('express')
const PORT = require('./utils/config').PORT

const app = express()
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get("/", (req, res) => {
  const status = {
    status: "OK",
    message: "Server is running"
  }
  res.send(status)
})