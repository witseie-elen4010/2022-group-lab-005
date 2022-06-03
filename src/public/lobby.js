'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')
// Try establish a connection with the server.
socket.connect()

socket.on('update_game_list', (openGames) => {
    document.getElementById('openGames').innerHTML = openGames
})