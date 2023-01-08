require("dotenv").config()
const express = require("express")
const app = express()
const axios = require("axios")
const { auth } = require("express-openid-connect")

app.set("view engine", "ejs")

// Associe les routes /login, /logout /callback to the à la baseURL
app.use(
  auth({
    authRequired: false, // Rend obligatoire l'authentification pour toutes les routes client
    auth0Logout: true, // Logout avec domaine custom
    secret: "LONG_RANDOM_STRING", // secret pour signer les cookies de session

    // Racine de l'application pour le router
    baseURL: "http://localhost:3000",
    // Optionnel, pour configurer son flow d'authent (et pas utiliser ce qui est proposé par défaut)
    authorizationParams: {
      response_type: "code", // Code Grant
      scope: "openid email", // 'openid' pour avoir un idToken, 'email' pour l'affichage
      // Nécessaire pour obtenir un JWT access_token avec les informations (claims)
      // Pour appeler le Serveur de Ressources
      // Sinon on obtient seulement un token opaque pour récupérer l'utilisateur (/userinfo)
      audience: process.env.AUDIENCE
    },
    // URL racine du Serveur d'Autorisation
    issuerBaseURL: process.env.ISSUER,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  })
)

app.get("/", function (request, response) {
  console.log(request.oidc.accessToken)
  console.log(request.oidc.user)
  response.render("index", { user: request.oidc?.user })
})

app.get("/formations", async function (request, response) {
  let formations

  try {
    let accessToken = request.oidc?.accessToken
    if (accessToken?.isExpired()) {
      accessToken = await accessToken.refresh()
    }

    if (accessToken) {
      const response = await axios.get("http://localhost:5000/formations", {
        headers: {
          Authorization: "Bearer " + accessToken.access_token
        }
      })
      formations = response.data
    }
  } catch (e) {
    console.log(e.message)
  }
  response.render("formations", { data: formations })
})

const port = 3000
app.listen(port)
console.log(`Client listening on port ${port}`)
