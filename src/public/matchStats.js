'use strict'

const appendGuess = (guess, timeStamp, guessNumber) => {
    const guessTable = document.querySelector('.guessTable') // Find the table we created
    let guessTableBodyRow = document.createElement('tr') // Create the current table row
    guessTableBodyRow.className = 'guessTableBodyRow'
    // Lines 72-85 create the 5 column cells that will be appended to the current table row
    let guessRank = document.createElement('td')
    guessRank.innerText = guessNumber
    let wordGuess = document.createElement('td')
    wordGuess.innerText = guess
    let timeData = document.createElement('td')
    timeData.innerText = timeStamp
    guessTableBodyRow.append(guessRank, wordGuess, timeData) // Append all 5 cells to the table row
    guessTable.append(guessTableBodyRow) // Append the current row to the guess table body
}
