'use strict'
const GameSettings = require('../src/services/settings_db.cjs')

test('Check dark mode is true option is successfully updated into Settings Table', () => {
  const darkmode = 'true'
  GameSettings.changeMode(darkmode, 'robyn').then(result => {
    expect(result).toBe(JSON.stringify({ message: `${darkmode} has been saved to the database` }))
  })
})

jest.setTimeout(30000)
  test('Check nothing is returned if user is not in database', () => {
    return GameSettings.getMode('bob').then(result => {
        expect(result.recordset[0]).toBe(undefined)
    })
  })

test('Check the correct dark mode setting is returned for user', () => {
    GameSettings.changeMode('true', 'robyn')
  return GameSettings.getMode('robyn').then(result => {
      expect(result.recordset[0].isDarkmode).toBe(true)
  })
})