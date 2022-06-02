const express = require('express')
const { set } = require('express/lib/application')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')
const soc = require('../src/services/socket.cjs')

describe('Test socket.cjs', () => {
  let io, serverSocket, clientSocket1, clientSocket2, clientSocket3
  const app = express()
  let port

  beforeAll((done) => {
    const httpServer = createServer(app)
    io = new Server(httpServer)
    httpServer.listen(() => {
      port = httpServer.address().port
      // Make three client sockets to simulate three clients that can connect.
      // Set their autoConnect to false so we have to tell them when to connect.
      clientSocket1 = new Client(`http://localhost:${port}`, { autoConnect: false })
      clientSocket2 = new Client(`http://localhost:${port}`, { autoConnect: false })
      clientSocket3 = new Client(`http://localhost:${port}`, { autoConnect: false })
      soc(io)
      done()
    })
  })

  // Close the server after we are done with all the tests.
  afterAll(() => {
    io.close()
  })

  // After each test, close all the client sockets.
  afterEach(() => {
    closeClientSocket(clientSocket1)
    closeClientSocket(clientSocket2)
    closeClientSocket(clientSocket3)
  })

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
}
