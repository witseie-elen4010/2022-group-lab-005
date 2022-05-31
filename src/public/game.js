'use strict'

window.onload = function () {

  let colourArray = [
    ["c", "c", "c", "c", "c"],
    ["c", "c", "c", "c", "c"],
    ["c", "c", "c", "c", "c"],
    ["c", "c", "c", "c", "c"],
    ["c", "c", "c", "c", "c"],
    ["c", "c", "c", "c", "c"]
  ]
  let table = document.getElementById("wordleTable")


  for(let i = 0; i < table.rows.length; i++)
  {
    for(let j = 0; j < table.rows[i].cells.length; j++)
    {
      table.rows[i].cells[j].innerHTML = colourArray[i][j]
    }
  }
}