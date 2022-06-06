'use strict'

const { v4: uuidv4 } = require('uuid')
const { createGame, getGameInformation, getPlayerNames, addPlayerToGame } = require('../services/lobby.cjs')

const allLettersArray = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']

module.exports = function (io) {
  /** ************** Middleware *****************/
  // This is called a middleware. Its a type of function that is run for every incoming connection.
  // In this case, it is being used for authentication. If the code is happy with the details that the
  // incoming connection specified, this code will add that connection to the specific room for the game.
  // See https://socket.io/docs/v4/middlewares/ for details.

  // This middleware will only fire if a connection is coming from the '/rooms' namespace.
  io.of('/rooms').use((socket, next) => {
    console.log('A lobby client has connected')

    // Attach a disconnect listener
    socket.on('disconnect', () => {
      console.log('A lobby client has disconnected')
    })

    // Get the open games and send them back to the client.
    const roomArr = getOpenGames(io)
    socket.emit('update_game_list', roomArr)

    // This must be here or else the connection will hang until it times out. Its part of the middleware stuff.
    next()
  })

  // This middleware will only fire if a connection is coming from the default ('/') namespace.
  io.use((socket, next) => {
    // When the a connection is attempted, the client sends an object that contains the player's name and a string called sessionInfo. This string is of the format:
    // x....xy where all the xs form the roomID and y is the number of players that are going to be in the game.
    getGameInfo(socket.handshake.auth.sessionInfo.substring(36, socket.handshake.auth.sessionInfo.length - 1)).then((queryResult) => {
      // We get the information about the game that is stored in the db.
      return queryResult
    }).then((resultFromQuery) => {
      socket.data.databaseID = parseInt(socket.handshake.auth.sessionInfo.substring(36, socket.handshake.auth.sessionInfo.length - 1))
      socket.data.wordToGuess = resultFromQuery.WordToGuess
      console.log(socket.data.wordToGuess)
      socket.data.playerID = socket.handshake.auth.playerID

      const numPlayers = resultFromQuery.NumPlayers

      // WILL FIX THIS!
      const playerName = socket.handshake.auth.playerName

      // We extract the number of players from the sessionInfo string.
      // const numPlayers = validateNumPlayers(socket.handshake.auth.sessionInfo.substring(socket.handshake.auth.sessionInfo.length - 1))

      // We add _game_ and numPlayers to the gameID so that we can determine if the room (socket.io) (which has a identity of gameID) is a game or if it is some other room.
      const gameID = `${socket.handshake.auth.sessionInfo.substring(0, socket.handshake.auth.sessionInfo.length)}_game_${numPlayers.toString()}`
      // const gameID = `${socket.handshake.auth.sessionInfo.substring(0, 36)}_game`

      if (numPlayers !== -1 && gameID.length !== 0 && playerName.length !== 0) {
        if (!isRoomEmpty(io, gameID)) {
          // This socket is not the first player to join the room. Let's check that the room isn't full
          if (numPlayers > parseInt(io.sockets.adapter.rooms.get(gameID).size)) {
            // The room isn't full yet so the game hasn't started.
            addPlayerToRoom(socket, gameID, playerName, numPlayers, io).then((result) => {
              // Check if the room is now full. If it is, start the game. Otherwise, tell the socket that just joined to wait.
              if (parseInt(io.sockets.adapter.rooms.get(socket.data.roomID).size) === parseInt(socket.data.numPlayers)) {
                // The room is now full. Let's start the game.
                console.log(`All ${socket.data.numPlayers} players have joined ${socket.data.roomID}, starting the game.`)

                // Before we start the game, let's query the DB and get a list of player names.
                getPlayerNames(socket.data.databaseID/* 38 */).then((result) => {
                  // I think there's a better way to do this (only using one event) but I couldn't get anything to work
                  // other than this. This first line broadcasts the 'game_can_start' event to all the sockets in the room
                  // except to the sender. The second line sends the 'game_can_start' event to the sender.
                  socket.to(socket.data.roomID).emit('game_can_start', result.recordset)
                  socket.emit('game_can_start', result.recordset)
                }
                ).catch(console.error)
              } else {
                // The room is not full yet so we tell the socket that just joined to wait.
                socket.emit('waiting_for_players')
              }

              // Update all the clients looking at the lobby page.
              io.of('/rooms').emit('update_game_list', getOpenGames(io))

              // This must be here or else the connection will hang until it times out. Its part of the middleware stuff.
              next()
            })
          } else {
            // The room is full and the game is running
            return next(new Error('game_already_running'))
          }
        } else {
          // This socket is the first player to join the room.
          addPlayerToRoom(socket, gameID, playerName, numPlayers, io).then((result) => {
            socket = result
            socket.emit('waiting_for_players')

            // Update all the clients looking at the lobby page.
            io.of('/rooms').emit('update_game_list', getOpenGames(io))

            // This must be here or else the connection will hang until it times out. Its part of the middleware stuff.
            next()
          })
        }
      } else {
        return next(new Error('invalid_game_id'))
      }
    })
  })

  /** *************Regular listeners*****************/

  // This listener will only fire if a connection is coming from the '/rooms' namespace.
  io.of('/rooms').on('connection', (socket) => {
    socket.on('create_game', function (numPlayers, modeChosen, customWord) {
      if (modeChosen === 1 || modeChosen === 2) {
        insertNewGameIntoDB(numPlayers, modeChosen, customWord).then((result) => {
          console.log(`Successfully created game with details Database ID=${result.ID} GameType=${result.ModeChosen} Word=${result.WordToGuess} NumPlayers=${result.NumPlayers}`)
          console.log(result)
          const clientGameID = `${uuidv4(result.ID).toString()}${result.ID.toString()}${numPlayers.toString()}`
          socket.emit('get_game_id', clientGameID)
        }).catch(() => {
          socket.emit('invalid_game_mode')
        })
      } else {
        socket.emit('invalid_game_mode')
      }
    })
  })

  // This listener will fire for a connection that comes from the default ('/') namespace.
  io.on('connection', (socket) => {
    socket.on('send_guess', function (letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray) {
      const currentWordArray = socket.data.wordToGuess.split('')
      const [letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin] = testWord(letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, currentWordArray)

      socket.emit('update_player_screen', letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin) // These values get sent back to the sender.
      socket.broadcast.to(socket.data.roomID).emit('update_opponent_colors', colorArr, didTheyWin, socket.data.playerName, socket.data.playerNum) // These values get broadcast to everyone except the sender.
    })

    socket.on('game_over', () => {
      socket.disconnect()
    })
  })
}

/** ********* Helper functions **************/

/**
 * @param {{ [x: string]: any[]; }} letterArray
 * @param {string | number} currentWordIndex
 * @param {{ [x: string]: string[]; }} colorArray
 * @param {string[]} currentWordCheck
 * @param {any[]} allLettersColorsArray
 * @param {any[]} currentWordArray
 */
function testWord (letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, currentWordArray) {
  // Check if the letters are in the correct places
  let correctWordCount = 0
  for (let i = 0; i < 5; i++) {
    const currentLetter = letterArray[currentWordIndex][i].toLowerCase()
    if (currentLetter === currentWordArray[i]) { // WORD TO GUESS
      colorArray[currentWordIndex][i] = 'c'
      currentWordCheck[i] = 'Y'
      allLettersColorsArray = updateAllLettersColorsArray('c', currentLetter, allLettersColorsArray)
      correctWordCount = correctWordCount + 1
    }
  }
  // Check if the letters are in the word at all
  for (let i = 0; i < 5; i++) {
    const currentLetter = letterArray[currentWordIndex][i].toLowerCase()
    for (let j = 0; j < 5; j++) {
      if (currentLetter === currentWordArray[j]) {
        if (currentWordCheck[j] === 'X') {
          colorArray[currentWordIndex][i] = 'i'
          currentWordCheck[j] = 'Y'
          allLettersColorsArray = updateAllLettersColorsArray('i', currentLetter, allLettersColorsArray)
          j = 5 // Break out of the for-loop as letter has been found
        }
      }
    }
    // Checks if the letter is not in the word at all to change the colors to dark grey
    if (!(colorArray[currentWordIndex][i] === 'i' || colorArray[currentWordIndex][i] === 'c')) {
      colorArray[currentWordIndex][i] = 'n'
      allLettersColorsArray = updateAllLettersColorsArray('n', currentLetter, allLettersColorsArray)
    }
  }

  currentWordCheck = ['X', 'X', 'X', 'X', 'X']

  if (correctWordCount === 5) {
    // The player has won!
    return [letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, true]
  } else {
    return [letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, false]
  }
}

/**
 * @description Updates all the color of the corresponding blocks in the color array that will be displayed to the client.
 * @param {string} color
 * @param {string} letter
 * @param {any[]} allLettersColorsArray
 * @returns {any[]} allLettersColorsArray
 */
function updateAllLettersColorsArray (color, letter, allLettersColorsArray) {
  for (let i = 0; i < allLettersArray.length; i++) {
    if (allLettersArray[i] === letter) {
      switch (color) {
        case 'i':
          if (allLettersColorsArray[i] !== 'c') {
            allLettersColorsArray[i] = color
          }
          break
        case 'c':
          allLettersColorsArray[i] = color
          break
        case 'n':
          if (allLettersColorsArray[i] !== 'c' && allLettersColorsArray[i] !== 'i') {
            allLettersColorsArray[i] = color
          }
          break
      }
    }
  }

  return allLettersColorsArray
}

// Returns true if the specified room is empty. False otherwise.
function isRoomEmpty (io, gameID) {
  if (io.sockets.adapter.rooms.get(gameID) === undefined) {
    return true
  } else {
    return false
  }
}

// Adds a player to the specified room and returns the socket object.
// Adds a disconnect listener to the socket.
async function addPlayerToRoom (socket, gameID, playerName, numPlayers, io) {
  return new Promise((resolve, reject) => {
    addPlayerToGame(socket.data.databaseID, socket.data.playerID).then(() => {
      if (isRoomEmpty(io, gameID)) {
        socket.data.playerNum = 1
      } else {
        socket.data.playerNum = parseInt(io.sockets.adapter.rooms.get(gameID).size) + 1
      }

      // We add a 'playerName' attribute *to* the socket object so we can
      // use that name later on.
      socket.data.playerName = playerName
      socket.data.roomID = gameID
      socket.data.numPlayers = numPlayers

      // Add the player to the room specified by gameID.
      socket.join(socket.data.roomID)
      console.log(`${playerName} has joined ${gameID}`)

      // Add a listener for when a connected socket leaves the server.
      socket.on('disconnect', () => {
        console.log(`${socket.data.playerName} has disconnected`)
      })

      resolve(socket)
    }).catch(reject)
  })
}

function getOpenGames (io) {
  const rooms = io.sockets.adapter.rooms // https://simplernerd.com/js-socketio-active-rooms/
  const roomArr = []

  rooms.forEach((value, key) => {
    if (key.includes('game')) {
      // Now we know that this room is a game room.
      // Let's see how many players are going to be playing.
      const expectedPlayerNum = parseInt(key.substring(key.length - 1))

      // Let's check if the room is empty
      if (isRoomEmpty(io, key)) {
        // The room is empty
        // idk what to do here. This code shouldn't be reachable tho.
      } else {
        const currentPlayerNum = parseInt(io.sockets.adapter.rooms.get(key).size)

        if (currentPlayerNum < expectedPlayerNum) {
          // There's at least one slot available.
          const temp = expectedPlayerNum - currentPlayerNum
          roomArr.push({ roomName: key.substring(0, key.indexOf('_')), availSlots: temp })
        }
      }
    }
  })

  return roomArr
}

async function getGameInfo (gameID) {
  return new Promise((resolve, reject) => {
    getGameInformation(gameID).then((queryResult) => {
      const resultsObj = JSON.parse(JSON.stringify(queryResult.recordset))
      resolve(resultsObj[0])
    })
  })
}

async function insertNewGameIntoDB (numPlayers, modeChosen, customWord) {
  return new Promise((resolve, reject) => {
    let gameData = {}
    if (modeChosen === 1) { // Regular game
      gameData = { gameMode: modeChosen, numPlayers, customWord: 'none' }
    } else if (modeChosen === 2) { // Custom game
      gameData = { gameMode: modeChosen, numPlayers, customWord }
    } else {
      reject
    }

    createGame(gameData).then((queryResult) => {
      const resultsObj = JSON.parse(JSON.stringify(queryResult.recordset))
      resolve(resultsObj[0])
    })
  })
}
