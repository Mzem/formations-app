require("dotenv").config()
const express = require("express")
const openid = require("openid-client")
const jose = require("jose")
const { formations } = require("./data.js")

const app = express()

app.get("/", async function (req, res) {
  res.send("hello world!")
})

app.get("/formations", async function (req, res) {
  const authorization = req.headers["authorization"]
  const accessToken = authorization?.replace(/bearer /gi, "")
  console.log(authorization)
  console.log(JSON.stringify(accessToken))
  const issuer = await openid.Issuer.discover(process.env.ISSUER)
  const jwksUrl = new URL(issuer.metadata.jwks_uri)
  const jwks = jose.createRemoteJWKSet(jwksUrl)

  try {
    const { payload } = await jose.jwtVerify(accessToken, jwks)
    console.log(payload)
  } catch (e) {
    console.log(e)
    return res.status(401).send({ code: 401, error: "FORBIDDEN" })
  }

  const result = formations
  res.send(result)
})

const port = 5000
app.listen(port)
console.log(`API listening on port ${port}`)
