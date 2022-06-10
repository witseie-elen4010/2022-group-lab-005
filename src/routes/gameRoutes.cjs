const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()

const gameRouter = express.Router()
const { getBackground, changeBackground } = require('../services/background_db.cjs')
const mainRouter = require('../mainRoutes.cjs')

gameRouter.post('/logWord', jsonParser, async function (req, res) { // works
  const word = req.body.wordToLog
  makeGuess(word, 1).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

gameRouter.get('/guess', function (pos, req) { // works
  req.sendFile(path.join(__dirname, '../views', 'test.html'))
})

gameRouter.get('/changeBackground', function (pos, req) {
  req.sendFile(path.join(__dirname, '../views', 'changeBackground.html'))
})

gameRouter.get('/play', function (pos, req) { // works
  req.sendFile(path.join(__dirname, '../views', 'game.html'))
})

// Just a temporary addition so that we can get to the game page without having to go through the lobby etc
gameRouter.get('/game_debug', function (pos, req) { // works
  req.sendFile(path.join(__dirname, '../views', 'game.html'))
})

gameRouter.get('/api/BackgroundData', async function (req, res) {
  const username = req.query.usernameInput
  getBackground(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

gameRouter.post('/newBackground', jsonParser, async function (req, res) { // ?
  const username = req.body.usernameInput
  const background = req.body.back

  console.log(`Server received: ${background}`)

  changeBackground(background, username).then(
    (result) => {
      res.send(JSON.stringify({ message: `${background} has been saved to the database` }))
    }
  ).catch(console.error)
})

module.exports = gameRouter
