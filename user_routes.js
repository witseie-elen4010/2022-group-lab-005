'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const LogIn = require('./services/login_db')
const mainRouter = express.Router()

mainRouter.get('/', function (req, res) {
  res.send('Hello World. I\'m a Node app.')
})

mainRouter.get('/Login', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'Login.html'))
})

mainRouter.use(bodyParser.urlencoded({ extended: false }))
mainRouter.use(bodyParser.json())

mainRouter.post('/log', async function (req, res) {
  const username = req.body.usernameInput
  const password = req.body.passwordInput

  // This will send the username and password to the server code
  // the await will wait for the program to finish before carring on
  const result = await LogIn(username, password)
  // send the result back to the client
  res.send({ loggedInOrNot: result })
})
module.exports = mainRouter
