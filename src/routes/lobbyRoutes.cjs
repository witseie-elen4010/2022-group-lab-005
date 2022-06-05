// NO TOUCHY!!! const ioFmIndex = require('../index')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()

const lobbyRouter = express.Router()

const { createGame } = require('../services/lobby.cjs')

lobbyRouter.post('/', async function (req, res) { // ?
  res.sendFile(path.join(__dirname, '../views', 'lobby.html'))
})

// NO TOUCHY!!

lobbyRouter.get('/', async function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'lobby.html'))
})

lobbyRouter.post('/create', async function (req, res) { // ?
  const result = await createGame(req.body)
})

module.exports = lobbyRouter
