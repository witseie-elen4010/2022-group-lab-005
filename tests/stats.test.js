'use strict'
const matchStats = require('../src/services/matchHistory')

jest.setTimeout(30000)
test('Check that a users games are correctly returned', () => {
    return matchStats.getUserStats(1).then(data => {
        expect(data.recordset[0].CountGuesses).toBe(2)
      }
    )
})

test('Check nothing is returned if a user has not won', () => {
    return matchStats.getUserStats(2).then(data => {
        expect(data.recordset.length).toBe(0)
    })
})

test('Check the users position is correctly returned', () => {
    return matchStats.getUserGames(2).then(data => {
        expect(data.recordset[0].Placement).toBe(2)
    })
})
