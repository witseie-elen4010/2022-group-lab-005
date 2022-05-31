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
let allLettersArray =         ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER",  "Z", "X", "C", "V", "B", "N", "M", "BACK"]
let  allLettersColorsArray =  ["d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "D",      "d", "d", "d", "d", "d", "d", "d", "d"]

// Updates the page on window load to display the default wordle table and keyboard table
window.onload = function () {
  updateWordleTableText()
  updateWordleTableColor()
  updateKeyboard()
  createKeyboard()
}

// Returns the table color array
function getWordleTableColor(){
  return colorArray
}

// Updates the color currently displayed in this user's wordle table
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

// Updates the text currently displayed in this user's wordle table
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

// Checks which letters of the inputted word matches the current word
function testWord(){
  // Check if the letters are in the correct places
  let correctWordCount = 0
  for(let i = 0; i < 5; i++){
    let currentLetter = letterArray[currentWordIndex][i]
    if(currentLetter == currentWordArray[i])
    {
      colorArray[currentWordIndex][i] = "c"
      currentWordCheck[i] = "Y"
      updateAllLettersColorsArray("c", currentLetter)
      correctWordCount = correctWordCount + 1
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
          updateAllLettersColorsArray("i", currentLetter)
          j = 5; //Break out of the for-loop as letter has been found
        }
      }      
    } 
    // Checks if the letter is not in the word at all to change the colors to dark grey
    if(!(colorArray[currentWordIndex][i] == "i" || colorArray[currentWordIndex][i] == "c"))
    {
      colorArray[currentWordIndex][i] = "n"
      updateAllLettersColorsArray("n", currentLetter)
    }  
  }
  currentWordCheck = ["X", "X", "X", "X", "X"]
  updateWordleTableColor()
  updateKeyboard()

  // Checks if the user inputted the correct word
  if(correctWordCount == 5)
  {
    console.log("WINNER WINNER CHICKEN DINNER")
    // NICK CONNECTION STUFF GOES HERE FOR WHEN A WORD IS COMPLETED AND CORRECT
  }
  else{
    // NICK CONNECTION STUFF GOES HERE FOR WHEN A WORD IS COMPLETED BUT NOT CORRECT
  }
}

// Updates the variable keeping track of what letter the user is on
function incrementLetterIndex(){
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

// Updates the letter color tracking array
function updateAllLettersColorsArray(color, letter){
  for(let i = 0; i < allLettersArray.length; i++)
  {
    if(allLettersArray[i] == letter){
      switch(color){
        case "i":
          if( allLettersColorsArray[i] != "c")
          {
             allLettersColorsArray[i] = color
          }
          break
        case "c":
           allLettersColorsArray[i] = color
          break
        case "n":
          if( allLettersColorsArray[i] != "c" &&  allLettersColorsArray[i] != "i")
          {
             allLettersColorsArray[i] = color
          }          
          break
      }
    }
  }
}

// Initialize the on-screen keyboard with the correct innerHTML and default grey colors
function createKeyboard(){
  let keyboardTable = document.getElementById("keyboardTable")
  let count = 0

  for(let i = 0; i < keyboardTable.rows.length; i++)
  {
    for(let j = 0; j < keyboardTable.rows[i].cells.length; j++)
    {
      keyboardTable.rows[i].cells[j].innerHTML = allLettersArray[count]
      keyboardTable.rows[i].cells[j].style.backgroundColor = "lightgrey"
      count = count + 1
    }
  }
}

// Updates the on-screen keyboard's colors
function updateKeyboard(){
  let keyboardTable = document.getElementById("keyboardTable")
  let count = 0
  for(let i = 0; i < keyboardTable.rows.length; i++)
  {
    for(let j = 0; j < keyboardTable.rows[i].cells.length; j++)
    {
      switch(allLettersColorsArray[count]){
        case "d":
        case "D":
          keyboardTable.rows[i].cells[j].style.backgroundColor = "lightgrey"
          break
        case "n":
        case "N":
          keyboardTable.rows[i].cells[j].style.backgroundColor = "grey"
          break
        case "i":
        case "I":
          keyboardTable.rows[i].cells[j].style.backgroundColor = "yellow"
          break
        case "c":
        case "C":
          keyboardTable.rows[i].cells[j].style.backgroundColor = "green"
          break
      }
      count = count + 1
    }
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
    for(let i = 0; i < allLettersArray.length; i++)
    {
      if(event.key.toUpperCase() == allLettersArray[i])
      {
        letterArray[currentWordIndex][currentLetterIndex] = event.key.toUpperCase()
        updateWordleTableText()
        incrementLetterIndex()
      }
    }
  }
})