'use strict'

const request = new XMLHttpRequest()
window.onload = getStatistics()

// Gets statistics from the database
function getStatistics(){
    request.open('GET', 'get/stats', true)
    request.addEventListener('load', recieveStats)
    request.send()
}

// Recieves query from the database
function recieveStats(){
    const response = JSON.parse(this.responseText)
    let guesses = [0,0,0,0,0,0]
    const displayedStats = document.getElementById('displayedStats')
    for(let i = 0; i < response.recordset.length; i++){
        guesses[response.recordset[i].CountGuesses - 1] += 1
    }
    const statistics = `Number of wins: ${response.recordset.length} <br> Guess distribution in wins: <br> 1: ${guesses[0]} <br> 2: ${guesses[1]} <br> 3: ${guesses[2]} <br> 4: ${guesses[3]} <br> 5: ${guesses[4]} <br> 6: ${guesses[5]}`
    displayedStats.innerHTML = statistics
}

