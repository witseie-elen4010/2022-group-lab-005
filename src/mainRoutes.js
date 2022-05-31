'use strict'
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')

const {LogIn,registerUser} = require('./services/loginDb')
const gameRouter = require('./routes/gameRoutes')
const lobbyRouter = require('./routes/lobbyRoutes')
const userRouter = require('./routes/userRoutes')

const jsonParser = bodyParser.json()

const mainRouter = express.Router()
mainRouter.use(bodyParser.urlencoded({ extended: false }))
mainRouter.use(bodyParser.json())
mainRouter.use('/user', userRouter)
mainRouter.use('/game', gameRouter)
mainRouter.use('/lobby', lobbyRouter)

/* GET */

mainRouter.get('/', function (req, res) { // works
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
})

mainRouter.get('/about', function (req, res) { // works
  res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

mainRouter.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

mainRouter.get('/loginRedirect', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
})

/* POST */

mainRouter.post('/log', async function (req, res) {
  const username = req.body.usernameInput
  const password = req.body.passwordInput

  // This will send the username and password to the server code
  // the await will wait for the program to finish before carring on
  LogIn(username, password).then((result) => {
    res.send({ loggedInOrNot: result })
  })
})

mainRouter.post('/register', async function (req, res) {
  const username = req.body.usernameInput
  const password = req.body.passwordInput

  // This will send the username and password to the server code
  // the await will wait for the program to finish before carring on
  registerUser(username, password).then((result) => {
    res.send({ loggedInOrNot: result })
  })
})


module.exports = mainRouter
