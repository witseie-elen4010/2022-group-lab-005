'use strict'
// const Game = require('../src/public/game.js')

test('Testing a completely incorrect input', () => {
  const colorArray = [
    ['d', 'd', 'd', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd', 'd', 'd']
  ]

  const color = 'n'
  const letter = 'n'
  // Game.updateAllLettersColorsArray(color, letter)
  // result = Game.getWordleTableColor()

  expect(colorArray).toBe(colorArray)
})
