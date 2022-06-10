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
                        let lastUser = response.recordset[0].Username
                        let count = 0
                        //Will be moved to the back-end
                        for(let i = 0; i < response.recordset.length; i++){
                            if(response.recordset[i].Username === lastUser){
                                count++
                            }
                            else{
                                count = 1
                                lastUser = response.recordset[i].Username
                            }
                            appendGuess(response.recordset[i].Word, response.recordset[i].TimeStamp, count, response.recordset[i].Username)
                        }
                    }).fail(
                        function (serverResponse) {
                            alert(serverResponse)
                        })
            }
        }
    ).catch()
})

//Adds all guesses to the match table
const appendGuess = (guess, timeStamp, guessNumber, user) => {
    const guessTable = document.querySelector('#guessTableBody') // Find the table we created
    let guessTableBodyRow = document.createElement('tr') // Create the current table row
    guessTableBodyRow.className = 'guessTableBodyRow'
    guessTable.className = 'table table-striped'
    // Create cells in the row
    let guessRank = document.createElement('td')
    guessRank.innerText = guessNumber
    let wordGuess = document.createElement('td')
    wordGuess.innerText = guess
    let timeData = document.createElement('td')
    timeData.innerText = new Date(timeStamp).toLocaleString()
    let userData = document.createElement('td')
    userData.innerText = user
    guessTableBodyRow.append(userData, guessRank, wordGuess, timeData) // Append all 4 cells to the table row
    guessTable.append(guessTableBodyRow) // Append the current row to the guess table body
}

//Returns to the previous menu
const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/user/stats'
}, false)

'use strict'
setModeForPage()
function setModeForPage () {
  const isDarkmode = getFromCookie('darkMode', document.cookie)
  //  set current current scheme
  if (isDarkmode === 'true') {
    document.body.classList.remove('bg-light')
    document.body.classList.add('bg-dark')
    document.body.style.color = 'white'
    document.getElementById('guessTable').classList.remove('table-striped')
    document.getElementById('guessTable').style.color = 'white'
    document.getElementById('guessTableBody').style.color = 'white'
  } else {
    document.body.classList.remove('bg-dark')
    document.body.classList.add('bg-light')
    document.body.style.color = 'black'
    document.getElementById('guessTable').classList.add('table-striped')
    document.getElementById('guessTable').style.color = 'black'
    document.getElementById('guessTableBody').style.color = 'black'
  }
}
