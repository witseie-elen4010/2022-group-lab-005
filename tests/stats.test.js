'use strict'
const exp = require('constants')
const matchStats = require('../src/services/matchHistory')
const { closeAll } = require('../src/services/poolManagement.cjs')

afterAll(() => {
    closeAll()
   })   

jest.setTimeout(30000)

test('Check parse stats correctly counts games', () => {
    let data = {
        "recordset": [
          {  "CountGuesses": "3" },
          { "CountGuesses": "5" },
          {  "CountGuesses": "4" },
          {  "CountGuesses": "4" },
          {  "CountGuesses": "3" },
          {  "CountGuesses": "1" },
          {  "CountGuesses": "2" }
        ]
    }
    let result = matchStats.parseStats(data)
        let expected = true
        if(result[0] !== 1){
            expected = false
        }
        if(result[1] !== 1){
            expected = false
        }
        if(result[2] !== 2){
            expected = false
        }
        if(result[3] !== 2){
            expected = false
        }
        if(result[4] !== 1){
            expected = false
        }
        if(result[5] !== 0){
            expected = false
        }
        expect(expected).toBe(true)
    
})


test('Check set mode correctly changes GameType', () => {
    let data = {
        "recordset": [
          {  "GameType": 1 },
          { "GameType": 2 }
        ]
    }
    let result = matchStats.setMode(data)
    let expected = true
    if(result.recordset[0].GameType !== 'Standard'){
        expected = false
    }
    if(result.recordset[1].GameType !== 'Custom'){
        expected = false
    }
    expect(expected).toBe(true)
})

test('Check that a users games are correctly returned', () => {
    return matchStats.getUserStats('Winner').then(data => {
        let sum = 0
        for(let i = 0; i < 6; i++){
            sum+= data[i]
        }
        expect(sum).toBe(7)
      }
    )
})

test('Check nothing is returned if a user has not won', () => {
    return matchStats.getUserStats('nomatch').then(data => {
        let sum = 0
        for(let i = 0; i < 6; i++){
            sum+= data[i]
        }
        expect(sum).toBe(0)
    })
})

test('Check the no matches are returned if the player has not played in a game', () => {
    return matchStats.getUserGames('nomatch').then(data => {
        expect(data.recordset.length).toBe(0)
    })
})

test('Check matches are properly returned', () => {
    return matchStats.getUserGuesses(1).then(data => {
        let expected = true
        if(data.recordset.length !== 7){
            expected = false
        }
        if(data.recordset[0].Username !== 'loser'){
            expected = false
        }
        if(data.recordset[0].Word !== 'space'){
            expected = false
        }
        if(data.recordset[6].Username !== 'winner'){
            expected = false
        }
        if(data.recordset[6].Word !== 'spice'){
            expected = false
        }
        expect(expected).toBe(true)
    })
})

test('Check matches are returned properly', () => {
    return matchStats.getUserGames('winner').then(data => {
        let expected = true
        if(data.recordset[0].GameType !== 'Standard'){
            expected = false
        }
        if(data.recordset[0].WordToGuess !== 'words'){
            expected = false
        }
        if(data.recordset[0].NumPlayers !== 2){
            expected = false
        }
        if(data.recordset[0].WhoWon !== 'winner'){
            expected = false
        }
        expect(expected).toBe(true)
    })
})
