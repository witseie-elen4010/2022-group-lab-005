'use strict'
const { get } = require('./poolManagement')

async function prevGameID () {
  return new Promise((resolve, reject) =>{
    const sqlCode = 'SELECT TOP 1 GameID FROM dbo.Game ORDER BY GameID DESC'
    console.log(sqlCode)
    get('default').then((pool) =>
        pool.request().query(sqlCode).then(
          (result) => {
            console.log(result.recordset[0].GameID)
            resolve(result.recordset[0].GameID)
          }
        )//.catch(console.error)
    )//.catch(console.error)
  })    
}

async function createGame (gameMode, newID) {
  const sqlCode = `INSERT INTO dbo.Game(GameID, GameType) VALUES ('${newID}', '${gameMode}');`
  console.log(sqlCode)
  get('default')
    .then((pool) =>
      pool
        .request()
        .query(sqlCode)
        .then((result) => {
          return result
        })
        .catch(console.error)
    )
    .catch(console.error)
}

module.exports = {createGame, prevGameID}

