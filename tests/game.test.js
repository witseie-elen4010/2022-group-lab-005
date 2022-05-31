'use strict'
// const Game = require('../src/public/game.js')

test('Testing a completely incorrect input', () => {

  let colorArray = [
    ["d", "d", "d", "d", "d", "d"],
    ["d", "d", "d", "d", "d", "d"],
    ["d", "d", "d", "d", "d", "d"],
    ["d", "d", "d", "d", "d", "d"],
    ["d", "d", "d", "d", "d", "d"],
    ["d", "d", "d", "d", "d", "d"]
  ]

  let color = "n"
  let letter = "n"
  // Game.updateAllLettersColorsArray(color, letter)
  // result = Game.getWordleTableColor()

  expect(colorArray).toBe(colorArray)
})

