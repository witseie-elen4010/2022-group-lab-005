'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')
// Try establish a connection with the server.
socket.connect()

socket.on('update_game_list', (openGames) => {

    let table = document.getElementById('gameInfo').getElementsByTagName('tbody')[0]

    for (let i = 0; i < openGames.length; i++) {
        let newRow = table.insertRow(i)
        let gameName = newRow.insertCell(0)
        let availPlayers = newRow.insertCell(1)

        gameName.innerHTML = openGames[i].roomName
        availPlayers.innerHTML = openGames[i].availSlots
    }

    //document.getElementById('openGames').innerHTML = openGames
})