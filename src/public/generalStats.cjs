'use strict'

$(function () {
    checkUser(document.cookie).then(
        (result) => {
            if (result === false) {
                window.location.href = '/login'
            } else {
                let username = getFromCookie('username', document.cookie)
                $.get('/user/get/stats', { user: username }).done(
                    // Recieves the user's stats
                    function (response) {
                        recieveStats(response)
                        $.get('/user/get/games', {user: username}).done(
                            function (out) {
                                for(let i = 0; i < out.recordset.length; i++){
                                    appendMatch(out.recordset[i].WordToGuess, out.recordset[i].GameType, out.recordset[i].NumPlayers, out.recordset[i].WhoWon)
                                }
                            }
                        )
                    }).fail(
                        function (serverResponse) {
                            alert(serverResponse)
                        })
            }
        }
    ).catch()
})

function recieveStats(response){
    let guesses = [0,0,0,0,0,0]
    const displayedStats = document.getElementById('displayedStats')
    for(let i = 0; i < response.recordset.length; i++){
        guesses[response.recordset[i].CountGuesses - 1] += 1
    }
    const statistics = `Number of wins: ${response.recordset.length} <br> Guess distribution in wins: <br> 1: ${guesses[0]} <br> 2: ${guesses[1]} <br> 3: ${guesses[2]} <br> 4: ${guesses[3]} <br> 5: ${guesses[4]} <br> 6: ${guesses[5]}`
    displayedStats.innerHTML = statistics
}

const appendMatch = (WordToGuess, GameType, NumPlayers, WhoWon) => {
    const matchTable = document.querySelector('.matchTable') // Find the table we created
    let matchTableBodyRow = document.createElement('tr') // Create the current table row
    matchTableBodyRow.className = 'matchTableBodyRow'
    // Create cells in the row
    let MatchType = document.createElement('td')
    MatchType.innerText = GameType
    MatchType.style.textAlign = "centre"
    let word = document.createElement('td')
    word.innerText = WordToGuess
    word.style.textAlign = "centre"
    let numberPlayers = document.createElement('td')
    numberPlayers.innerText = NumPlayers
    numberPlayers.style.textAlign = "centre"
    let winner = document.createElement('td')
    winner.innerText = WhoWon
    winner.style.textAlign = "centre"
    matchTableBodyRow.append(MatchType, word, numberPlayers, winner) // Append all 4 cells to the table row
    matchTable.append(matchTableBodyRow) // Append the current row to the guess table body
}
