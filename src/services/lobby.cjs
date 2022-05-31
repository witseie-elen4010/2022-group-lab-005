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
        }).reject(console.error)
    ).reject(console.error)
  })
}

async function createGame (input) {
  return new Promise((resolve, reject) => {
    const sqlCode = `INSERT INTO dbo.Game(GameType, NumPlayers) VALUES ('${input.gameModeInput}','${input.numPlayers}');`
    get('default').then((pool) =>
      pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }).reject(console.error)
    ).reject(console.error)
  })
}

module.exports = { createGame, prevGameID }
