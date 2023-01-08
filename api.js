const express = require("express")
const app = express()

const { formations } = require("./data.js")

const API_KEY = "test"

app.get("/", async function (req, res) {
  res.send("hello world!")
})

app.get("/formations", async function (req, res) {
  const apiKeyFromHeader = req.headers["x-api-key"]

  if (API_KEY !== apiKeyFromHeader) {
    res.status(401).send({ code: 401, error: "FORBIDDEN" })
    return
  }

  const result = formations
  res.send(result)
})

const port = 5000
app.listen(port, function () {
  console.log(`API listening on port ${port}`)
})
