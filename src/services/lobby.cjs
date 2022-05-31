'use strict'
const { get } = require('./poolManagement.cjs')

async function prevGameID () {
  return new Promise((resolve, reject) => {
    const sqlCode = 'SELECT TOP 1 GameID FROM dbo.Game ORDER BY GameID DESC'
    get('default').then((pool) =>
      pool.request().query(sqlCode).then(
        (result) => {
          console.log(result.recordset[0].GameID)
          resolve(result.recordset[0].GameID)
        }).catch(reject)
    ).catch(reject)
  })
}

async function createGame (input) {
  return new Promise((resolve, reject) => {
    let modeChosen = 0
    if(input.gameModeInput === 'Standard'){
      modeChosen = 1
    }
    else{ // More modes can be added here in future, this conversion to int could be done initially. ie Player choosing standard sends 1
      modeChosen = 2
    }
    const sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
    SELECT TOP 1 '${modeChosen}', Word, '${input.numPlayers}'
    FROM [dbo].[Vocabulary]
    ORDER BY NEWID();`
    get('default').then((pool) =>
      pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }).catch(reject)
    ).catch(reject)
  })
}

module.exports = { createGame, prevGameID }
