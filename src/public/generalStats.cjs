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
                                    appendMatch(out.recordset[i].WordToGuess, out.recordset[i].GameType, out.recordset[i].NumPlayers, out.recordset[i].WhoWon, out.recordset[i].ID)
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

const appendMatch = (WordToGuess, GameType, NumPlayers, WhoWon, gameID) => {
    const matchTable = document.querySelector('#matchTableBody') // Find the table we created
    let matchTableBodyRow = document.createElement('tr') // Create the current table row
    matchTableBodyRow.className = 'matchTableBodyRow'
    // Create cells in the row
    matchTable.className = 'table table-striped'
    let MatchType = document.createElement('td')
    MatchType.innerText = GameType
    let word = document.createElement('td')
    word.innerText = WordToGuess
    let numberPlayers = document.createElement('td')
    numberPlayers.innerText = NumPlayers
    let winner = document.createElement('td')
    winner.innerText = WhoWon
    let toMatchButton = document.createElement('button')
    let toMatch = document.createElement('td')
    toMatchButton.className = "btn btn-outline-primary"
    toMatchButton.innerText = "View Match"
    toMatchButton.onclick = function () {
        window.location.href='/user/match/?gameID='+gameID
    }
    toMatch.append(toMatchButton)
    matchTableBodyRow.append(MatchType, word, numberPlayers, winner, toMatch) // Append all 4 cells to the table row
    matchTable.append(matchTableBodyRow) // Append the current row to the guess table body
}

const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/'
}, false)


