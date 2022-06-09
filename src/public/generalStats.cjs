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
                        $.get('/user/get/games', { user: username }).done(
                            function (out) {
                                for (let i = 0; i < out.recordset.length; i++) {
                                    appendMatch(out.recordset[i].WordToGuess, out.recordset[i].GameType, out.recordset[i].NumPlayers, out.recordset[i].WhoWon, out.recordset[i].ID, out.recordset[i].GameDateTime)
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

//Creates general stats doughnut chart
function recieveStats(response) {
    let guesses = [0, 0, 0, 0, 0, 0]
    const displayedStats = document.getElementById('displayedStats')
    for (let i = 0; i < response.recordset.length; i++) {
        guesses[response.recordset[i].CountGuesses - 1] += 1
    }
    let guessLabels = ["1", "2", "3", "4", "5", "6"]
    let barColors = ["red", "green", "blue", "orange", "brown", "purple"]

    new Chart("myChart", {
        type: "doughnut",
        data: {
            labels: guessLabels,
            datasets: [{
                backgroundColor: barColors,
                data: guesses
            }]
        },
        options: {
            legend: { display: true },
            title: {
                display: false,
                text: "Guess Distribution in Wins:"
            }
        }
    })

}

//Adds the match stats to the match list
const appendMatch = (WordToGuess, GameType, NumPlayers, WhoWon, gameID, DateTime) => {
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
    let gameDate = document.createElement('td')
    gameDate.innerText = new Date(DateTime).toLocaleString()
    let toMatchButton = document.createElement('button')
    let toMatch = document.createElement('td')
    toMatchButton.className = "btn btn-outline-primary"
    toMatchButton.innerText = "View Match"
    toMatchButton.onclick = function () {
        window.location.href = '/user/match/?gameID=' + gameID
    }
    toMatch.append(toMatchButton)
    matchTableBodyRow.append(MatchType, word, numberPlayers, winner, gameDate, toMatch) // Append all 5 cells to the table row and the button
    matchTable.append(matchTableBodyRow) // Append the current row to the guess table body
}

const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
    location.href = '/'
}, false)


