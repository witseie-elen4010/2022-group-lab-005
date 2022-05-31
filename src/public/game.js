'use strict'
let letterArray = [
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""]
]
let colorArray = [
  ["d", "d", "d", "d", "d", "d"],
  ["d", "d", "d", "d", "d", "d"],
  ["d", "d", "d", "d", "d", "d"],
  ["d", "d", "d", "d", "d", "d"],
  ["d", "d", "d", "d", "d", "d"],
  ["d", "d", "d", "d", "d", "d"]
]

let currentWordArray = ["H", "E", "L", "L", "O"]
let currentWordCheck = ["X", "X", "X", "X", "X"]
let currentWordIndex = 0
let currentLetterIndex = 0
let lettersLeft = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

window.onload = function () {
  updateWordleTableText()
  updateWordleTableColor()
}

function getWordleTableColor(){
  return colorArray
}

function updateWordleTableColor(){
  let table = document.getElementById("wordleTable")
  let tempColor = "grey"
  for(let i = 0; i < table.rows.length; i++)
  {
    for(let j = 0; j < table.rows[i].cells.length; j++)
    {
      switch(colorArray[i][j])
      {
        case "d":
        case "D":
          table.rows[i].cells[j].style.backgroundColor = "lightgrey"
          break
        case "n":
        case "N":
          table.rows[i].cells[j].style.backgroundColor = "grey"
          break
        case "i":
        case "I":
          table.rows[i].cells[j].style.backgroundColor = "yellow"
          break
        case "c":
        case "C":
          table.rows[i].cells[j].style.backgroundColor = "green"
          break
      }
    }
  }
}

function updateWordleTableText(){
  let table = document.getElementById("wordleTable")
  for(let i = 0; i < table.rows.length; i++)
  {
    for(let j = 0; j < table.rows[i].cells.length; j++)
    {
      table.rows[i].cells[j].innerHTML = letterArray[i][j]
    }
  }
}

function testWord(){
  // Check if the letters are in the correct places
  for(let i = 0; i < 5; i++){
    let currentLetter = letterArray[currentWordIndex][i]
    if(currentLetter == currentWordArray[i])
    {
      colorArray[currentWordIndex][i] = "c"
      currentWordCheck[i] = "Y"
    }
  }
  // Check if the letters are in the word at all 
  for(let i = 0; i < 5; i++){
    let currentLetter = letterArray[currentWordIndex][i]
    for(let j = 0; j < 5; j++){
      if(currentLetter == currentWordArray[j])
      {
        if(currentWordCheck[j] == "X")
        {
          colorArray[currentWordIndex][i] = "i"
          currentWordCheck[j] = "Y"
          j = 5; //Break out of the for-loop as letter has been found
        }
      }      
    } 
    if(!(colorArray[currentWordIndex][i] == "i" || colorArray[currentWordIndex][i] == "c"))
    {
      colorArray[currentWordIndex][i] = "n"
    }  
  }
  currentWordCheck = ["X", "X", "X", "X", "X"]
  updateWordleTableColor()
}

function moveLetter(){
  if(currentLetterIndex < 4)
  {
    currentLetterIndex = currentLetterIndex + 1
  }
  else{
    testWord()
    currentLetterIndex = 0
    currentWordIndex = currentWordIndex + 1
  }
}

document.addEventListener('keydown', function(event){
  if(event.key == "Backspace")
  {
    if(currentLetterIndex > 0){
      currentLetterIndex = currentLetterIndex - 1
    }
    letterArray[currentWordIndex][currentLetterIndex] = ""
    updateWordleTableText()
  }
  else
  {
    for(let i = 0; i < lettersLeft.length; i++)
    {
      if(event.key.toUpperCase() == lettersLeft[i])
      {
        letterArray[currentWordIndex][currentLetterIndex] = event.key.toUpperCase()
        updateWordleTableText()
        moveLetter()
      }
    }
  }
})

