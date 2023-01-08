const express = require("express")
const app = express()

const { formations } = require("./data.js")

app.get("/", async function (req, res) {
  res.send("hello world!")
})

app.get("/formations", async function (req, res) {
  const result = formations
  res.send(result)
})

const port = 5000
app.listen(port, function () {
  console.log(`API listening on port ${port}`)
})
