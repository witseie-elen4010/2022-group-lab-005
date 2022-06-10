'use strict'
const GameSettings = require('../src/services/settingsDb.cjs')
const { closeAll } = require('../src/services/poolManagement.cjs')

afterAll(() => {
  closeAll()
})

test('Check dark mode is true option is successfully updated into Settings Table', () => {
  const darkmode = 'true'
  GameSettings.changeMode(darkmode, 'robyn').then(result => {
    expect(result).toBe(JSON.stringify({ message: `${darkmode} has been saved to the database` }))
  })
})

test('Check password is updated in the Users table ', () => {
  const password = 'e0f2c4b6d02d2769d585c7035dda43d5327460f53ff8508e9695e9af3bc9fe61'
  GameSettings.changePassword(password, 'bob').then(result => {
    expect(result).toBe(JSON.stringify({ message: `${password} has been saved to the database` }))
  })
})

jest.setTimeout(30000)
test('Check nothing is returned if user is not in database', () => {
  return GameSettings.getMode('').then(result => {
    expect(result.recordset[0]).toBe(undefined)
  })
})

test('Check the correct dark mode setting is returned for user', () => {
  GameSettings.changeMode('true', 'robyn')
  return GameSettings.getMode('robyn').then(result => {
    expect(result.recordset[0].isDarkmode).toBe(true)
  })
})
