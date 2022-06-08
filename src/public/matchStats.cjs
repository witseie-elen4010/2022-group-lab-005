'use strict'

$(function () {
    checkUser(document.cookie).then(
        (result) => {
            if (result === false) {
                window.location.href = "/login"
            }
            else {
                let username = getFromCookie('username', document.cookie)
                const params = new Proxy(new URLSearchParams(window.location.search), {
                    get: (searchParams, prop) => searchParams.get(prop),
                })
                let gameID = params.gameID
                $.get('/user/get/match', {user:username, game: gameID}).done(
                    // Recieves the user's match
                    function (response) {
                        for(let i = 0; i < response.recordset.length; i++){
                            appendGuess(response.recordset[i].Word, response.recordset[i].TimeStamp, i+1)
                        }
                    }).fail(
                        function (serverResponse) {
                            alert(serverResponse)
                        })
            }
        }
    ).catch()
})

const appendGuess = (guess, timeStamp, guessNumber) => {
    const guessTable = document.querySelector('.guessTable') // Find the table we created
    let guessTableBodyRow = document.createElement('tr') // Create the current table row
    guessTableBodyRow.className = 'guessTableBodyRow'
    // Create cells in the row
    let guessRank = document.createElement('td')
    guessRank.innerText = guessNumber
    guessRank.style.textAlign = "centre"
    let wordGuess = document.createElement('td')
    wordGuess.innerText = guess
    wordGuess.style.textAlign = "centre"
    let timeData = document.createElement('td')
    timeData.innerText = timeStamp
    timeData.style.textAlign = "centre"
    guessTableBodyRow.append(guessRank, wordGuess, timeData) // Append all 5 cells to the table row
    guessTable.append(guessTableBodyRow) // Append the current row to the guess table body
}
