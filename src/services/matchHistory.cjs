'use strict'

const { get } = require('./poolManagement.cjs')

async function getUserGames(user) {
  // Returns the placement and GameID of any game the user took part in
  const sqlCode = `SELECT GameID, Placement 
  FROM [dbo].[UserGame] 
  WHERE UserID='${user}';`
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

async function getUserStats(username) {
  // Returns all guesses made in games the user won
  const sqlCode = `SELECT [dbo].[UserGame].GameID, COUNT([dbo].[Guess].Word) AS CountGuesses
  FROM [dbo].[UserGame]
  INNER JOIN [dbo].[Guess] ON [dbo].[UserGame].Username = [dbo].[Guess].Username
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

module.exports = {
  getUserGames: getUserGames,
  getUserStats: getUserStats
}