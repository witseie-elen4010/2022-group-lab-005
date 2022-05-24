'use strict'
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')

const LogIn = require('./services/login_db')
const { createWord, checkWord } = require('./services/wordQuery')
const { createGame, prevGameID } = require('./services/lobby.js')
const { getMode, changeMode } = require('./services/settings_db')

const jsonParser = bodyParser.json()

const mainRouter = express.Router()
mainRouter.use(bodyParser.urlencoded({ extended: false }))
mainRouter.use(bodyParser.json())

let user = ''
/* GET */

mainRouter.get('/', function (req, res) { // works
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
})

mainRouter.get('/about', function (req, res) { // works
  res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

mainRouter.get('/api/DarkModeData', async function (req, res) {
  const result = await getMode('user')
  res.send(result)
})

mainRouter.get('/settings', function (req, res) { // works
  res.sendFile(path.join(__dirname, 'views', 'settings.html'))
})

mainRouter.get('/test', function (pos, req) { // works
  req.sendFile(path.join(__dirname, 'views', 'test.html'))
})

mainRouter.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

/* POST */

mainRouter.post('/lobby', async function (req, res) { // ?
  res.sendFile(path.join(__dirname, 'views', 'lobby.html'))
})

mainRouter.post('/game', async function (req, res) { // ?
  const prevResult = await prevGameID()
  const newID = parseInt(prevResult) + 1
  const result = await createGame(req.body.gameModeInput, newID)
  res.sendFile(path.join(__dirname, 'views', 'game.html'))
})

mainRouter.post('/changeMode', jsonParser, async function (req, res) { // ?
  const darkMode = req.body.darkMode
  console.log(`Server received: ${darkMode}`)

  const result = await changeMode(darkMode)
  res.send(JSON.stringify({ message: `${darkMode} has been saved to the database` }))
})

mainRouter.post('/logWord', jsonParser, async function (req, res) { // works
  const word = req.body.wordToLog

  if (/^[a-zA-Z]+$/.test(word) === true & word.length === 5) {
    try {
      createWord(word).then(data => {
        // Now we check that the number of rows affected is equal to one since only
        // one row must be added. If this is anything but one, then an error has occurred.
        const numRows = JSON.parse(JSON.stringify(data)).rowsAffected.at(0)

        if (numRows === 1) {
          checkWord(word, 1).then((check) => {
            if (check) { // Displays if the guessed word is correct
              res.send(JSON.stringify({ message: `${word} has been saved to the database, you guess the correct word!` }))
            } else {
              res.send(JSON.stringify({ message: `${word} has been saved to the database, you NONCE that's the wrong word! D:<` }))
            }
          }).catch(console.error)
        } else {
          res.send(JSON.stringify({ message: `There was an error saving ${word} to the database` }))
        }
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    res.send(JSON.stringify({ message: `${word} is invalid. It must be 5 letters long and only be alphabetical` }))
  }
})

mainRouter.post('/log', async function (req, res) {
  const username = req.body.usernameInput
  const password = req.body.passwordInput
  user = req.body.usernameInput
  // This will send the username and password to the server code
  // the await will wait for the program to finish before carring on
  const result = await LogIn(username, password)
  // send the result back to the client
  res.send({ loggedInOrNot: result })
})

module.exports = mainRouter
