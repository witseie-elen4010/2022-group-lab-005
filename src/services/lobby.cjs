'use strict'
const { get } = require('./poolManagement.cjs')

async function createGame (input) {
  return new Promise((resolve, reject) => {
    let sqlCode = ""
    if(input.gameMode === 1){
      sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
    SELECT TOP 1 '${input.gameMode}', Word, '${input.numPlayers}'
    FROM [dbo].[Vocabulary]
    ORDER BY NEWID();`
    }
    else{ // More modes can be added here in future, this conversion to int could be done initially. ie Player choosing standard sends 1
      sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
    SELECT TOP 1 '${input.gameMode}', '${input.customWord}', '${input.numPlayers}';`
    }
    get('default').then((pool) =>
      pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }).catch(reject)
    ).catch(reject)
  })
}

module.exports = { createGame }
