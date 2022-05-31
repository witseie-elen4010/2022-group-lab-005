'use strict'
module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  // When a new player attempts to join the server.
  // TODO CHECK THAT THE SAME USER ISN'T ALREADY IN THE LOBBY!!
  io.use((socket, next) => {
    const playerName = socket.handshake.auth.playerName
    if (!playerName) {
      return next(new Error('invalid_playername'))
    } else {
      console.log(`${playerName} has joined the game`)
      // We add a 'playerName' attribute *to* the socket object so we can
      // use that name later on.
      socket.playerName = playerName
      next()
    }
  })
}
