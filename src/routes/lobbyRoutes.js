// NO TOUCHY!!! const ioFmIndex = require('../index')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()

const lobbyRouter = express.Router()

const { createGame, prevGameID } = require('../services/lobby.js')
// NO TOUCHY!! const { Router } = require('express')

// NO TOUCHY!!const { getNumPlayers } = require('../services/soc')

lobbyRouter.post('/', async function (req, res) { // ?
  res.sendFile(path.join(__dirname, '../views', 'lobby.html'))
})

// NO TOUCHY!!
/* lobbyRouter.get('/', async function (req, res) { // ?
  res.sendFile(path.join(__dirname, '../views', 'lobby.html'))
}) */

// NO TOUCHY!!
/* lobbyRouter.post('/join', async function (req, res) { // ?
  if (getNumPlayers() === undefined) {
    // No body is in the room, so lets join it and wait for the others.
    console.log('No players in the room')
  } else {
    console.log(getNumPlayers())
  }
}) */

lobbyRouter.post('/create', async function (req, res) { // ?
  /* //NO TOUCHY!!
  if (getNumPlayers() === undefined) {
    // No body is in the room, so lets join it and wait for the others.
    console.log('No players in the room')
  } else {
    console.log(getNumPlayers())
  } */

  const prevResult = await prevGameID()
  const newID = parseInt(prevResult) + 1
  const result = await createGame(req.body.gameModeInput, newID)
  res.sendFile(path.join(__dirname, '../views', 'game.html'))
})

module.exports = lobbyRouter
