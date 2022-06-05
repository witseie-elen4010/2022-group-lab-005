'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')
const request = new XMLHttpRequest()
// Try establish a connection with the server.
socket.connect()

$("#customWordField").hide() // Standard is default so the custom word field is hidden
$("#customWordField").append(`<div class="form-floating mb-3"><input type="text" class="form-control" id="customWord" placeholder="Custom word"><label for="floatingInput">Custom word</label><div id="invalidWord" class="invalid-feedback"><div id="feedbackText"></div></div></div>`)
$('#invalidWord').hide()

// This shows the number of players selected by the slider.
$("#currentNumPlayers").html($("#numPlayers").val())

// Makes the customWord field visible if the mode is custom
$('#gameModeContainer input:radio').on('click', () => {
    if($('#standard').is(':checked')) {
        $("#customWordField").fadeOut('fast')
    } else if ($('#custom').is(':checked')) {
        $("#customWordField").fadeIn('fast')
    } else {
        console.log('Something weird has happened. This should not be reached!')
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
            let gameType = newRow.insertCell(2)
            let joinBtn = newRow.insertCell(3)

            gameName.innerHTML = openGames[i].roomName
            availPlayers.innerHTML = openGames[i].availSlots
            gameType.innerHTML = 'TODO'
            joinBtn.innerHTML = `<button class="btn btn-primary col-4 rounded-pill" id="${openGames[i].roomName}">Join game</button>`
            document.getElementById(gameName.innerHTML).addEventListener('click', joinRunningGame)
        }

    } else {
        // There are no open games, so we must clear the table.
        const emptyTblBdy = document.createElement('tbody')
        table.parentNode.replaceChild(emptyTblBdy, table)
    }
})


socket.on('get_game_id', (gameID) => {
    console.log(gameID)
    console.log(`UUID: ${gameID.substring(0, 36)} GameID: ${gameID.substring(36)}`)
    sessionStorage.setItem('gameID', gameID)
    window.location.href = `/game/play`  
})


/*
// When the user clicks the create game button and the game is standard, the server is sent the details of the game. If it is happy, 
// it will create an unique game ID that will be received here.
socket.on('get_game_id_reg_game', (gameID) => {
    sessionStorage.setItem('gameID', gameID)
    sessionStorage.setItem('gameType', 'regular')
    window.location.href = `/game/play`  
})

// When the user clicks the create game button and the game is custom, the server is sent the details of the game. If it is happy, 
// it will create an unique game ID that will be received here.
socket.on('get_game_id_custom_game', (gameID) => {
    sessionStorage.setItem('gameID', gameID)
    sessionStorage.setItem('gameType', 'custom')
    window.location.href = `/game/play`  
})*/


function joinRunningGame() {
    sessionStorage.setItem('gameID', this.id)
    window.location.href = `/game/play` 
}

document.getElementById('createGameBtn').addEventListener('click', () => {
    const numPlayers = $("#numPlayers").val()

    let gameType
    
    if (document.getElementById("standard").checked === true) {
        gameType = 'standard'
    } else {
        gameType = 'custom'
    }

    let modeChosen = 1
    
    // Checks if the custom word chosen is valid if the game mode is custom
    if (document.getElementById("custom").checked) {
        modeChosen = 2

        if (document.getElementById('customWord').value !== "") { 
            if (document.getElementById('customWord').value.length !== 5) {
                document.getElementById('feedbackText').innerHTML = 'Oi, words have to be 5 letters, so I think you should do that.'
                $('#invalidWord').show()
                document.getElementById('customWord').className = 'form-control is-invalid'
                return
            }
        } else {
            document.getElementById('feedbackText').innerHTML = `If you didn't want to pick a word, why did you pick custom... Standard is fun cause it's a random word.`
            $('#invalidWord').show()
            document.getElementById('customWord').className = 'form-control is-invalid'
            return
        }
    }

    socket.connect()
    socket.emit('create_game', numPlayers, modeChosen, document.getElementById('customWord').value)
    /*
    // Creates the game in the database
    console.log("HELLO about to send")
    request.open('POST', '/lobby/create', true)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(JSON.stringify({ numPlayers: $("#numPlayers").val() , customWord: document.getElementById('customWord').value, gameMode: modeChosen}))
    
    socket.connect()
    socket.emit('create_game', gameType, numPlayers)
    */
})