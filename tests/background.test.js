'use strict'
const GameBackground = require('../src/services/background_db.cjs')


test('Check Mountains option is successfully updated into UserSettings Table', () => {
  const background = "Mountains";
  GameBackground.changeBackground(background).then(result => {
    const myBackground = result.recordset[0].Background;
    expect(result).toBe(myBackground)
  })
})

test('Check Forest option is successfully updated into UserSettings Table', () => {
  const background = "Forest";
  GameBackground.changeBackground(background).then(result => {
    const myBackground = result.recordset[0].Background;
    expect(result).toBe(myBackground)
  })
})

test('Check Beach option is successfully updated into UserSettings Table', () => {
  const background = "Beach";
  GameBackground.changeBackground(background).then(result => {
    const myBackground = result.recordset[0].Background;
    expect(result).toBe(myBackground)
  })
})