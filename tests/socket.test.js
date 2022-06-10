jest.setTimeout(25000)

const express = require('express')
const { set } = require('express/lib/application')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')
const soc = require('../src/services/socket.cjs')

describe('Test socket.cjs', () => {
  let io, port
  const app = express()

  beforeAll((done) => {
    const httpServer = createServer(app)
    io = new Server(httpServer)
    httpServer.listen(() => {
      port = httpServer.address().port
      soc(io)
      done()
    })
  })

  // Close the server after we are done with all the tests.
  afterAll((done) => {
    io.close()
    done()
  })

  test('Send invalid session information (invalid game id format)', (done) => {
    // Make the client.
    const gameClient = new Client(`http://localhost:${port}`, { autoConnect: false })

    gameClient.auth = { sessionInfo: 'xazwsx!', playerName: 'nick' }

    gameClient.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      gameClient.close()
      done()
    })

    gameClient.connect()
  })

  test('Send invalid session information (no game id)', (done) => {
    // Make the client.
    const gameClient = new Client(`http://localhost:${port}`, { autoConnect: false })

    gameClient.auth = { sessionInfo: '', playerName: 'nick' }

    gameClient.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      gameClient.close()
      done()
    })

    gameClient.connect()
  })

  test('Send invalid session information (invalid characters in database id', (done) => {
    // Make the client.
    const gameClient = new Client(`http://localhost:${port}`, { autoConnect: false })

    gameClient.auth = { sessionInfo: '31ff815f-3ed9-48a9-9eb3-7117ddffa3ed52!!', playerName: 'nick' }

    gameClient.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      gameClient.close()
      done()
    })

    gameClient.connect()
  })

  /*
  test('Send invalid session information (invalid database id', (done) => {
    // Make the client.
    const gameClient = new Client(`http://localhost:${port}`, { autoConnect: false })

    gameClient.auth = { sessionInfo: '31ff815f-3ed9-48a9-9eb3-7117ddffa3ed002', playerName: 'nick' }

    gameClient.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      gameClient.close()
      done()
    })

    gameClient.connect()
  })
  */

  test('Send valid session information', (done) => {
    // Make the client.
    const gameClient = new Client(`http://localhost:${port}`, { autoConnect: false })

    gameClient.auth = { sessionInfo: '31ff815f-3ed9-48a9-9eb3-7117ddffa3ed5242', playerName: 'nick' }

    gameClient.on('connect_error', (err) => {
      expect(err.message).toBe('game_already_running')
      gameClient.close()
      done()
    })

    gameClient.connect()
  })

  test('Connect to the lobby while no games are active', (done) => {
    // Make the client.
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('update_game_list', (openGames) => {
      expect(openGames.length).toBe(0)
      lobbyClient.close()
      done()
    })

    lobbyClient.connect()
  })

  test('Create a regular game with 2 players', (done) => {
    // Make the client.
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      expect(gameType).toBe('StandardCreate')
      // TODO Validate gameID
      lobbyClient.close()
      done()
    })

    lobbyClient.on('invalid_word', () => {
      lobbyClient.close()
      throw new Error('invalid_word')
    })

    lobbyClient.on('invalid_game_mode', () => {
      lobbyClient.close()
      throw new Error('invalid_game_mode')
    })

    lobbyClient.on('invalid_player_number', () => {
      lobbyClient.close()
      throw new Error('invalid_player_number')
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 2, 1, 'none')
  })

  test('Create a regular game with 0 players', (done) => {
    // Make the client.
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      lobbyClient.close()
      throw new Error('get_game_id should not run because the player number is invalid.')
    })

    lobbyClient.on('invalid_word', () => {
      lobbyClient.close()
      throw new Error('invalid_word')
    })

    lobbyClient.on('invalid_game_mode', () => {
      lobbyClient.close()
      throw new Error('invalid_game_mode')
    })

    lobbyClient.on('invalid_player_number', () => {
      lobbyClient.close()
      done()
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 0, 1, 'none')
  })

  test('Create a custom game with 3 players using the word \'hello\'', (done) => {
    // Make the client.
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      lobbyClient.close()
      expect(gameType).toBe('CustomCreate')
      done()
    })

    lobbyClient.on('invalid_word', () => {
      lobbyClient.close()
      throw new Error('invalid_word')
    })

    lobbyClient.on('invalid_game_mode', () => {
      lobbyClient.close()
      throw new Error('invalid_game_mode')
    })

    lobbyClient.on('invalid_player_number', () => {
      lobbyClient.close()
      throw new Error('invalid_player_number')
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 3, 2, 'hello')
  })

  test('Create a game with an invalid game mode', (done) => {
    // Make the client.
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      lobbyClient.close()
      throw new Error('get_game_id should not run because the player number is invalid.')
    })

    lobbyClient.on('invalid_word', () => {
      lobbyClient.close()
      throw new Error('invalid_word')
    })

    lobbyClient.on('invalid_game_mode', () => {
      lobbyClient.close()
      done()
    })

    lobbyClient.on('invalid_player_number', () => {
      lobbyClient.close()
      throw new Error('invalid_player_number')
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 3, 9, 'none')
  })

  test('Create a regular game with 2 players and connect both of them to the game', (done) => {
    // Make the client.
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      expect(gameType).toBe('StandardCreate')
      lobbyClient.close()

      let didClient1Connect = false

      // Now we make another client and attempt to connect it to the game.
      // Try establish a connection with the server.
      const gameClient1 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient1.auth = { sessionInfo: clientGameID, playerName: 'nick' }

      gameClient1.on('waiting_for_players', () => {
        didClient1Connect = true
      })

      const gameClient2 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient2.auth = { sessionInfo: clientGameID, playerName: 'user' }

      gameClient2.on('game_can_start', () => {
        expect(didClient1Connect).toBe(true)
        done()

        gameClient1.close()
        gameClient2.close()
      })

      gameClient1.connect()

      setTimeout(function () {
        gameClient2.connect()
      }, 3000)
    })

    lobbyClient.on('invalid_word', () => {
      lobbyClient.close()
      throw new Error('invalid_word')
    })

    lobbyClient.on('invalid_game_mode', () => {
      lobbyClient.close()
      throw new Error('invalid_game_mode')
    })

    lobbyClient.on('invalid_player_number', () => {
      lobbyClient.close()
      throw new Error('invalid_player_number')
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 2, 1, 'none')
  })

  test('Create a custom game with 3 players to test the behavior of a completely incorrect guess.', (done) => {
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      lobbyClient.close()

      const gameClient1 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient1.auth = { sessionInfo: clientGameID, playerName: 'jesse1' }

      const gameClient2 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient2.auth = { sessionInfo: clientGameID, playerName: 'jesse2' }

      const gameClient3 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient3.auth = { sessionInfo: clientGameID, playerName: 'jesse3' }

      gameClient3.on('game_can_start', () => {
        const correctLetterArray = [['G', 'U', 'E', 'S', 'S'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
        const correctColorArray = [['n', 'n', 'n', 'n', 'n'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd']]
        const correctCurrentWordCheck = ['X', 'X', 'X', 'X', 'X']
        const correctDidTheyWin = false
        const correctCurrWordIndex = 0
        const correctAllLettersColorsArray = ['d', 'd', 'n', 'd', 'd', 'd', 'n', 'd', 'd', 'd', 'd', 'n', 'd', 'd', 'n', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']

        gameClient3.on('update_player_screen', (letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin, wordToGuess) => {
          expect(allLettersColorsArr.toString()).toBe(correctAllLettersColorsArray.toString())
          expect(currWordIndex).toBe(correctCurrWordIndex)
          expect(currentWordCheck.toString()).toBe(correctCurrentWordCheck.toString())
          expect(didTheyWin).toBe(correctDidTheyWin)
          expect(letterArr.toString()).toBe(correctLetterArray.toString())
          expect(colorArr.toString()).toBe(correctColorArray.toString())
          done()
          gameClient1.close()
          gameClient2.close()
          gameClient3.close()
        })

        const letterArray = [['G', 'U', 'E', 'S', 'S'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
        const currentWordIndex = 0
        const colorArray = [['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd']]
        const currentWordCheck = ['X', 'X', 'X', 'X', 'X']
        const allLettersColorsArray = ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']

        gameClient3.emit('send_guess', letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray)
      })

      gameClient1.connect()

      setTimeout(function () {
        gameClient2.connect()
      }, 3000)

      setTimeout(function () {
        gameClient3.connect()
      }, 3000)
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 3, 2, 'point')
  })

  test('Create a custom game with 3 players to test the behavior of a guess with some correct and some letters in the wrong space.', (done) => {
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      lobbyClient.close()

      const gameClient1 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient1.auth = { sessionInfo: clientGameID, playerName: 'jesse1' }

      const gameClient2 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient2.auth = { sessionInfo: clientGameID, playerName: 'jesse2' }

      const gameClient3 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient3.auth = { sessionInfo: clientGameID, playerName: 'jesse3' }

      gameClient3.on('game_can_start', () => {
        const correctLetterArray = [['P', 'A', 'T', 'T', 'Y'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
        const correctColorArray = [['c', 'n', 'i', 'n', 'n'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd']]
        const correctCurrentWordCheck = ['X', 'X', 'X', 'X', 'X']
        const correctDidTheyWin = false
        const correctCurrWordIndex = 0
        const correctAllLettersColorsArray = ['d', 'd', 'd', 'd', 'i', 'n', 'd', 'd', 'd', 'c', 'n', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']

        gameClient3.on('update_player_screen', (letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin, wordToGuess) => {
          expect(allLettersColorsArr.toString()).toBe(correctAllLettersColorsArray.toString())
          expect(currWordIndex).toBe(correctCurrWordIndex)
          expect(currentWordCheck.toString()).toBe(correctCurrentWordCheck.toString())
          expect(didTheyWin).toBe(correctDidTheyWin)
          expect(letterArr.toString()).toBe(correctLetterArray.toString())
          expect(colorArr.toString()).toBe(correctColorArray.toString())
          done()
          gameClient1.close()
          gameClient2.close()
          gameClient3.close()
        })

        const letterArray = [['P', 'A', 'T', 'T', 'Y'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
        const currentWordIndex = 0
        const colorArray = [['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd']]
        const currentWordCheck = ['X', 'X', 'X', 'X', 'X']
        const allLettersColorsArray = ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']

        gameClient3.emit('send_guess', letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray)
      })

      gameClient1.connect()

      setTimeout(function () {
        gameClient2.connect()
      }, 3000)

      setTimeout(function () {
        gameClient3.connect()
      }, 3000)
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 3, 2, 'point')
  })

  test('Create a custom game with 3 players to test the behavior of a correct guess.', (done) => {
    const lobbyClient = new Client(`http://localhost:${port}/rooms`, { autoConnect: false })

    lobbyClient.on('get_game_id', (clientGameID, gameType) => {
      lobbyClient.close()

      const gameClient1 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient1.auth = { sessionInfo: clientGameID, playerName: 'jesse1' }

      const gameClient2 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient2.auth = { sessionInfo: clientGameID, playerName: 'jesse2' }

      const gameClient3 = new Client(`http://localhost:${port}`, { autoConnect: false })
      gameClient3.auth = { sessionInfo: clientGameID, playerName: 'jesse3' }

      gameClient3.on('game_can_start', () => {
        const correctLetterArray = [['P', 'O', 'I', 'N', 'T'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
        const correctColorArray = [['c', 'c', 'c', 'c', 'c'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd']]
        const correctCurrentWordCheck = ['X', 'X', 'X', 'X', 'X']
        const correctDidTheyWin = true
        const correctCurrWordIndex = 0
        const correctAllLettersColorsArray = ['d', 'd', 'd', 'd', 'c', 'd', 'd', 'c', 'c', 'c', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c', 'd', 'd']

        gameClient3.on('update_player_screen', (letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin, wordToGuess) => {
          expect(allLettersColorsArr.toString()).toBe(correctAllLettersColorsArray.toString())
          expect(currWordIndex).toBe(correctCurrWordIndex)
          expect(currentWordCheck.toString()).toBe(correctCurrentWordCheck.toString())
          expect(didTheyWin).toBe(correctDidTheyWin)
          expect(letterArr.toString()).toBe(correctLetterArray.toString())
          expect(colorArr.toString()).toBe(correctColorArray.toString())
          done()
          gameClient1.close()
          gameClient2.close()
          gameClient3.close()
        })

        const letterArray = [['P', 'O', 'I', 'N', 'T'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
        const currentWordIndex = 0
        const colorArray = [['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd'], ['d', 'd', 'd', 'd', 'd']]
        const currentWordCheck = ['X', 'X', 'X', 'X', 'X']
        const allLettersColorsArray = ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']

        gameClient3.emit('send_guess', letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray)
      })

      gameClient1.connect()

      setTimeout(function () {
        gameClient2.connect()
      }, 3000)

      setTimeout(function () {
        gameClient3.connect()
      }, 3000)
    })

    lobbyClient.connect()
    lobbyClient.emit('create_game', 3, 2, 'point')
  })
})

// Old tests
/*
  test('Send invalid session information (invalid character for number of players)', (done) => {
    clientSocket1.auth = { sessionInfo: 'xazwsx!', playerName: 'nick' }
    clientSocket1.connect()

    clientSocket1.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      done()
    })
  })

  test('Send invalid session information (number of players too small)', (done) => {
    clientSocket1.auth = { sessionInfo: 'xazwsx0', playerName: 'nick' }
    clientSocket1.connect()

    clientSocket1.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      done()
    })
  })

  test('Send invalid session information (number of players too large)', (done) => {
    clientSocket1.auth = { sessionInfo: 'xazwsx9', playerName: 'nick' }
    clientSocket1.connect()

    clientSocket1.on('connect_error', (err) => {
      expect(err.message).toBe('invalid_game_id')
      done()
    })
  })

  test('Send valid session information but not enough players have joined to start the game', (done) => {
    clientSocket1.auth = { sessionInfo: 'xazwsx2', playerName: 'nick' }
    clientSocket1.connect()

    clientSocket1.on('waiting_for_players', () => {
      done()
    })
  })

  test('Send valid session information and enough players have joined to start the game', (done) => {
    clientSocket1.auth = { sessionInfo: 'xazwsx2', playerName: 'nick' }
    clientSocket2.auth = { sessionInfo: 'xazwsx2', playerName: 'nick' }

    let client1Wait = false
    let client1Play = false

    clientSocket1.on('waiting_for_players', () => {
      client1Wait = true
    })

    clientSocket1.on('game_can_start', () => {
      client1Play = true
    })

    let client2Wait = false
    let client2Play = false

    clientSocket2.on('waiting_for_players', () => {
      client2Wait = true
    })

    clientSocket2.on('game_can_start', () => {
      client2Play = true
    })

    clientSocket1.connect()

    // Need to add a little delay here or else the two clients will connect at almost the exact same instant. This will not let the
    // 'waiting_for_players' event trigger.
    setTimeout(function () {
      clientSocket2.connect()
    }, 500)

    setTimeout(function () {
      expect(client1Wait).toBe(true)
      expect(client2Wait).toBe(false)
      expect(client1Play).toBe(true)
      expect(client2Play).toBe(true)
      done()
    }, 1000)
  })

  test('Let another player connect while a game is running', (done) => {
    clientSocket1.auth = { sessionInfo: 'xazwsx2', playerName: 'nick1' }
    clientSocket2.auth = { sessionInfo: 'xazwsx2', playerName: 'nick2' }
    clientSocket3.auth = { sessionInfo: 'xazwsx2', playerName: 'I shouldnt connect' }

    clientSocket1.connect()

    // Need to add a little delay here or else the two clients will connect at almost the exact same instant.
    setTimeout(function () {
      clientSocket2.connect()
      setTimeout(function () {
        clientSocket3.on('connect_error', (err) => {
          expect(err.message).toBe('game_already_running')
          done()
        })
        clientSocket3.connect()
      }, 250)
    }, 250)
  })
})

function closeClientSocket (sock) {
  // If auth isn't defined, then the socket hasn't connected.
  if (sock.auth !== undefined) {
    sock.close()
  }
} */
