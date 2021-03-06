'use strict'
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')

const { LogIn, registerUser, getUser } = require('./services/loginDb.cjs')
const gameRouter = require('./routes/gameRoutes.cjs')
const lobbyRouter = require('./routes/lobbyRoutes.cjs')
const userRouter = require('./routes/userRoutes.cjs')

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

mainRouter.get('/log', async function (req, res) {
  const username = req.query.usernameInput
  const password = req.query.passwordInput

  // This will send the username and password to the server code
  // the await will wait for the program to finish before carring on
  LogIn(username, password).then((result) => {
    res.send({ loggedInOrNot: result })
  })
})

mainRouter.get('/register', async function (req, res) {
  const username = req.query.usernameInput
  const password = req.query.passwordInput

  // This will send the username and password to the server code
  // the await will wait for the program to finish before carring on
  registerUser(username, password).then((result) => {
    res.send({ loggedInOrNot: result })
  })
})
mainRouter.post('/get/user', function (req, res) {
  getUser(req.body.user).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

module.exports = mainRouter
