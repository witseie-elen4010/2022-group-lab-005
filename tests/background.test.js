'use strict'
const GameBackground = require('../src/services/background_db.cjs')

test('Check Beach option is successfully updated into Settings Table', () => {
  const background = 'Beach'
  GameBackground.changeBackground(background, 'robyn').then(result => {
    expect(result).toBe(JSON.stringify({ message: `${background} has been saved to the database` }))
  })
})

jest.setTimeout(30000)
  test('Check nothing is returned if user is not in database', () => {
    return GameBackground.getBackground('bob').then(result => {
        expect(result.recordset[0]).toBe(undefined)
    })
  })

test('Check the correct background is returned for user', () => {
  GameBackground.changeBackground('Beach', 'robyn')
  return GameBackground.getBackground('robyn').then(result => {
      expect(result.recordset[0].Background).toBe('Beach')
  })
})