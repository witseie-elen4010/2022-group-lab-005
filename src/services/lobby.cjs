'use strict'
const { get } = require('./poolManagement.cjs')

async function createGame(input) {
  return new Promise((resolve, reject) => {
    let sqlCode = ""
    if (input.gameMode === 1) {
      sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
                 SELECT TOP 1 '1', Word, '${input.numPlayers}'
                 FROM [dbo].[Vocabulary]
                 ORDER BY NEWID();
                 SELECT TOP 1 [dbo].[Game].ID, [dbo].[Game].NumPlayers, [dbo].[Game].WordToGuess, [dbo].[Game].[GameType]
                 FROM [dbo].[Game]
                 ORDER BY [dbo].[Game].ID DESC;`
    }
    else { // More modes can be added here in future, this conversion to int could be done initially. ie Player choosing standard sends 1
      //sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
      //SELECT TOP 1 '${input.gameMode}', '${input.customWord}', '${input.numPlayers}';`
      sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
                 SELECT TOP 1 '2', '${input.customWord}', '${input.numPlayers}';
                 SELECT TOP 1 [dbo].[Game].ID, [dbo].[Game].NumPlayers, [dbo].[Game].WordToGuess, [dbo].[Game].[GameType]
                 FROM [dbo].[Game]
                 ORDER BY [dbo].[Game].ID DESC;`
    }
    get('default').then((pool) =>
      pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }).catch(reject)
    ).catch(reject)
  })
}

async function getGameInformation(gameID) {

  let sqlCode = `SELECT TOP 1 [dbo].[Game].ID, [dbo].[Game].NumPlayers, [dbo].[Game].WordToGuess,[dbo].[Game].[GameType]
                 FROM [dbo].[Game]
                 WHERE [dbo].[Game].ID = ${gameID};`

  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

async function getPlayerNames(gameID) {
  let sqlCode = `SELECT [dbo].Users.Username 
                 FROM [dbo].[UserGame], [dbo].Users 
                 WHERE GameID = ${gameID};`

  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

async function addPlayerToGame(gameID, userID) {
  let sqlCode = `INSERT INTO [dbo].[UserGame] (UserID, GameID)
                 SELECT '${userID}', '${gameID}';`

  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

module.exports = { createGame, getGameInformation, getPlayerNames, addPlayerToGame}
