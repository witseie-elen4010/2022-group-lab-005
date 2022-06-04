'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')
const request = new XMLHttpRequest()
// Try establish a connection with the server.
socket.connect()

$("#customWordField").hide() // Standard is default so the custom word field is hidden

$("#currentNumPlayers").html($("#numPlayers").val())

// Makes the customWord field visible if the mode is custom
$("#gameMode").on('change', function () {
    if (this.value === "custom") {
        $("#customWordField").show()
    }
    else {
        $("#customWordField").hide()
    }
})

// Dynamically changes the number of players displayed
$("#numPlayers").on('change', function() {
    $("#currentNumPlayers").html($("#numPlayers").val())
})

// When this is fired, the game list is updated with a new list of open games.
// This will be triggered when some event causes one or more players to join or leave games.
socket.on('update_game_list', (openGames) => {

    let table = document.getElementById('gameInfo').getElementsByTagName('tbody')[0]

    if (openGames.length !== 0) {

        // Add the new open games to the table.
        for (let i = 0; i < openGames.length; i++) {
            let newRow = table.insertRow(i)
            let gameName = newRow.insertCell(0)
            let availPlayers = newRow.insertCell(1)

            gameName.innerHTML = openGames[i].roomName
            availPlayers.innerHTML = openGames[i].availSlots
        }
    } else {
        // There are no open games, so we must clear the table.
        const emptyTblBdy = document.createElement('tbody')
        table.parentNode.replaceChild(emptyTblBdy, table)
    }
})

// When the user clicks the create game button, the server is sent the details of the game. If it is happy, 
// it will create an unique game ID that will be received here.
socket.on('get_game_id', (gameID) => {
    sessionStorage.setItem('gameID', gameID)
    alert(`Please share ${gameID} with your friends!`)
    window.location.href = `/game/play`  
})

document.getElementById('createGameBtn').addEventListener('click', () => {
    const numPlayers = $("#numPlayers").val()
    const gameType = $("#gameMode").val()
    let modeChosen = 1
    
    // Checks if the custom word chosen is valid if the game mode is custom
    if ($("#gameMode").val() === "custom") {
        modeChosen = 2
        if ($("#customWord").val() != "") { 
            if ($("#customWord").val().length != 5) {
                window.alert("Oi, words have to be 5 letters, so I think you should do that.")
                $("#customWord").focus()
                return
            }
        } else {
            window.alert("If you didn't want to pick a word, why did you pick custom... Standard is fun cause it's a random word.")
            $("#customWord").focus()
            return
        }
    }
    // Creates the game in the database
    console.log("HELLO about to send")
    request.open('POST', '/lobby/create', true)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(JSON.stringify({ numPlayers: $("#numPlayers").val() , customWord: $("#customWord").val(), gameMode: modeChosen}))

    socket.connect()
    socket.emit('create_game', gameType, numPlayers)
})

document.getElementById('joinGameBtn').addEventListener('click', () => {
    // Get the existing gameID
    const gameID = document.getElementById('existingGameID').value
    sessionStorage.setItem('gameID', gameID)
    window.location.href = `/game/play`
})