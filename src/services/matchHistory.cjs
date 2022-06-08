'use strict'

const { get } = require('./poolManagement.cjs')

async function getUserGames (user) {
  // Returns the placement and GameID of any game the user took part in
  const sqlCode = `SELECT [dbo].[Game].WordToGuess, [dbo].[Game].GameType, [dbo].[Game].NumPlayers, [dbo].[Game].WhoWon, [dbo].[Game].ID
  FROM [dbo].[Game]
  INNER JOIN [dbo].[UserGame] ON [dbo].[Game].ID = [dbo].[UserGame].GameID
  WHERE [dbo].[UserGame].Username = '${user}';`
  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          let output = setMode(result)
          resolve(output)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

async function getUserStats (username) {
  // Returns all guesses made in games the user won
  const sqlCode = `SELECT [dbo].[UserGame].GameID, COUNT([dbo].[Guess].Word) AS CountGuesses
  FROM [dbo].[UserGame]
  INNER JOIN [dbo].[Guess] ON [dbo].[UserGame].Username = [dbo].[Guess].Username AND [dbo].[UserGame].GameID = [dbo].[Guess].GameID
  WHERE [dbo].[UserGame].Username = '${username}' AND [dbo].[UserGame].Placement = '1'
  GROUP BY [dbo].[UserGame].GameID;`// Placement = 1 because that is a player who won
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

async function getUserGuesses(gameId, username){
  const sqlCode = `SELECT Word, TimeStamp FROM [dbo].[Guess] WHERE (GameID = '${gameId}' AND Username = '${username}');`
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

function setMode(input){
  const size = input.recordset.length
  for(let i = 0; i < size; i++){
    let type = input.recordset[i].GameType
    if(type === 1){
      input.recordset[i].GameType = 'Standard'
    }
    else{
      input.recordset[i].GameType = 'Custom'
    }
  }
  return input
}

module.exports = {
  getUserGames: getUserGames,
  getUserStats: getUserStats,
  getUserGuesses: getUserGuesses
}
