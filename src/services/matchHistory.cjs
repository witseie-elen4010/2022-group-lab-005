'use strict'
const { resolve } = require('path')
const { get } = require('./poolManagement.cjs')

async function getUserGames(userID) {
  // Returns the placement and GameID of any game the user took part in
  const sqlCode = `SELECT GameID, Placement 
  FROM [dbo].[UserGame] 
  WHERE UserID='${userID}';`
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

async function getUserStats(userID) {
  // Returns all guesses made in games the user won
  const sqlCode = `SELECT [dbo].[UserGame].GameID, COUNT([dbo].[Guess].GuessWord) AS CountGuesses
  FROM [dbo].[UserGame]
  INNER JOIN [dbo].[Guess] ON [dbo].[UserGame].UserID = [dbo].[Guess].UserID
  WHERE [dbo].[UserGame].UserID = '${userID}' AND [dbo].[UserGame].Placement = '1' 
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

module.exports = {
  getUserGames: getUserGames,
  getUserStats: getUserStats
}