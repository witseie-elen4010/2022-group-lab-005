'use strict'
const Lobby = require('../services/lobby')

test('Check that the standard game mode is successfully inserted into the database Game table', () => {
  const gameMode = 'Standard'
  const gameID = 0
  Lobby.createGame(gameMode, gameID).then(result => {
    const myGameMode = result.recordset[0].GameType
    expect(myGameMode).toBe(gameMode)
  })
})

test('Check that the custom game mode is successfully inserted into the database Game table', () => {
  const gameMode = 'Custom'
  const gameID = 0
  Lobby.createGame(gameMode, gameID).then(result => {
    const myGameMode = result.recordset[0].GameType
    expect(myGameMode).toBe(gameMode)
  })
})

test('Check that the most recent GameID is successfully selected', () => {
  Lobby.prevGameID().then(result => {
    expect(result).toBe(1000)
  })
})
