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
        })// .catch(console.error)
    )// .catch(console.error)
  })
}

async function createGame (gameMode, newID) {
  return new Promise((resolve, reject) => {
    const sqlCode = `INSERT INTO dbo.Game(GameID, GameType) VALUES ('${newID}', '${gameMode}');`
    get('default').then((pool) =>
      pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        })// .catch(console.error)
    )// .catch(console.error)
  })
}

module.exports = { createGame, prevGameID }
