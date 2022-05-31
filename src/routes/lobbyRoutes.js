// NO TOUCHY!!! const ioFmIndex = require('../index')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()

const lobbyRouter = express.Router()

const { createGame, prevGameID } = require('../services/lobby.js')

lobbyRouter.post('/', async function (req, res) { // ?
  res.sendFile(path.join(__dirname, '../views', 'lobby.html'))
})

// NO TOUCHY!!
lobbyRouter.get('/', async function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'lobby.html'))
})

lobbyRouter.post('/create', async function (req, res) { // ?
  const prevResult = await prevGameID()
  const newID = parseInt(prevResult) + 1
  const result = await createGame(req.body.gameModeInput, newID)
  res.sendFile(path.join(__dirname, '../views', 'game.html'))
})

module.exports = lobbyRouter
