-'use strict'

const { closeAll } = require('../src/services/poolManagement.cjs')
const { createGame, getGameInformation, getPlayerNames, removePlayerFromGame, addPlayerToGame, logPlayersGuess, logWinningPlayer, getGameGuesses, isGuessAWord } = require('../src/services/lobby.cjs')

afterAll(() => {
  closeAll()
})
jest.setTimeout(30000)

let standardGameID
test('Standard game is successfully created', async () => {
  const input = { numPlayers: 2, gameMode: 1 }
  await createGame(input).then(result => {
    expect(result.recordset[0].GameType).toBe(1)
    expect(result.recordset[0].NumPlayers).toBe(2)
    standardGameID = result.recordset[0].ID
  })
})

test('Custom game is successfully created', async () => {
  const input = { numPlayers: 3, gameMode: 2, customWord: 'hello' }
  await createGame(input).then(result => {
    expect(result.recordset[0].GameType).toBe(2)
    expect(result.recordset[0].NumPlayers).toBe(3)
    expect(result.recordset[0].WordToGuess).toBe('hello')
  })
})

test('Game information can be retrieved', async () => {
  await getGameInformation(16).then(result => {
    expect(result.recordset[0].GameType).toBe(2)
    expect(result.recordset[0].NumPlayers).toBe(3)
    expect(result.recordset[0].WordToGuess).toBe('Yesio')
  })
})

// there is a game where there is jesse1, jesse2 and jesse3 as participants
test('Player names can be retrieved', async () => {
  await getPlayerNames(1018).then(result => {
    // console.log(result.recordset[0].Username)
    expect(result.recordset[0].Username).toBe('jesse1')
    expect(result.recordset[1].Username).toBe('jesse2')
    expect(result.recordset[2].Username).toBe('jesse3')
  })
})

test('Get all guesses for the game', async () => {
  await getGameGuesses(1018).then(result => {
    expect(result.recordset[0].Username).toBe('jesse3')
    expect(result.recordset[0].WORD).toBe('POINT')
  })
})

test('Is guess a word', async () => {
  await isGuessAWord('hello').then(result => {
    expect(result).toBe(true)
  })

  await isGuessAWord('qwert').then(result => {
    expect(result).toBe(false)
  })

  await isGuessAWord('12H-l').then(result => {
    throw new Error('Result should not return a boolean value')
  }).catch(err => {
    expect(err.message).toBe('Word contains invalid characters')
  })
})
// Inserting , updating and deleting will not be included in the tests, as it can either break due to primary key issues , or it would flood the databse with testing so it is not good.
