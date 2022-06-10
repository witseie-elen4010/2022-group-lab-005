'use strict'

const { closeAll } = require('../src/services/poolManagement.cjs')
const { createGame, getGameInformation, getPlayerNames, removePlayerFromGame, addPlayerToGame, logPlayersGuess, logWinningPlayer, getGameGuesses, isGuessAWord } = require('../src/services/lobby.cjs')

describe('Test lobby.cjs', () => {
  afterAll(() => {
    closeAll()
  })

  let standardGameID
  test('Standard game is successfully created', () => {
    const input = { numPlayers: 2, gameMode: 1 }
    createGame(input).then(result => {
      expect(result.recordset[0].GameType).toBe(1)
      expect(result.recordset[0].NumPlayers).toBe(2)
      standardGameID = result.recordset[0].ID
    })
  })

  test('Custom game is successfully created', () => {
    const input = { numPlayers: 3, gameMode: 2, customWord: 'hello' }
    createGame(input).then(result => {
      expect(result.recordset[0].GameType).toBe(2)
      expect(result.recordset[0].NumPlayers).toBe(3)
      expect(result.recordset[0].WordToGuess).toBe('hello')
    })
  })

  test('Game information can be retrieved', () => {
    getGameInformation(standardGameID).then(result => {
      expect(result.recordset[0].GameType).toBe(2)
      expect(result.recordset[0].NumPlayers).toBe(3)
      expect(result.recordset[0].WordToGuess).toBe('point')
    })
  })

  test('Add 2 players to game', () => {
    addPlayerToGame(standardGameID, 'jesse1').then(result => {
      expect(result.rowsAffected[0]).toBe(1)
      expect(result.recordset[0].Username).toBe('jesse1')
      expect(result.recordset[0].GameID).toBe(standardGameID)
    })

    addPlayerToGame(standardGameID, 'jesse2').then(result => {
      expect(result.rowsAffected[0]).toBe(1)
      expect(result.recordset[0].Username).toBe('jesse2')
      expect(result.recordset[0].GameID).toBe(standardGameID)
    })
  })

  test('Remove player from game', () => {
    removePlayerFromGame(standardGameID, 'jesse1').then(result => {
      expect(result.rowsAffected[0]).toBe(1)
    })
  })

  test('Player names can be retrieved', () => {
    getPlayerNames(1018).then(result => {
      console.log(result.recordset[0])
    })
  })

  test('Log a player\'s guess', () => {
    logPlayersGuess('hello', standardGameID, 'jesse2').then(result => {
      expect(result.rowsAffected[0]).toBe(1)
      expect(result.recordset[0].Word).toBe('hello')
      expect(result.recordset[0].GameID).toBe(standardGameID)
      expect(result.recordset[0].Username).toBe('jesse2')
    })
  })

  test('Log which player won', () => {
    logWinningPlayer(standardGameID, 'jesse2').then(result => {
      expect(result.rowsAffected[0]).toBe(1)
      expect(result.recordset[0].WhoWon).toBe('jesse2')
      expect(result.recordset[0].GameID).toBe(standardGameID)
    })
  })

  test('Get all guesses for the game', () => {
    getGameGuesses(standardGameID).then(result => {
      expect(result.rowsAffected[0]).toBe(1)
      expect(result.recordset[0].Username).toBe('jesse2')
      expect(result.recordset[0].GameID).toBe(standardGameID)
      expect(result.recordset[0].Word).toBe('hello')
    })
  })

  test('Is guess a word', () => {
    isGuessAWord('hello').then(result => {
      expect(result).toBe(true)
    })

    isGuessAWord('qwert').then(result => {
      expect(result).toBe(false)
    })

    isGuessAWord('12H-l').then(result => {
      throw new Error('Result should not return a boolean value')
    }).catch(err => {
      expect(err.message).toBe('Word contains invalid characters')
    })
  })
})
