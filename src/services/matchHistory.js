'use strict'
const { resolve } = require('path')
const { get } = require('./poolManagement')

async function getUserGames(userID) {
  // Returns the placement and GameID of any game the user took part in
  const sqlCode = `SELECT GameID, Placement FROM [dbo].[UserGame] WHERE UserID='${userID}';`
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

async function getUserStats(gamesList, userID) {
  // Returns all guesses made in games the user won
  let sqlCode = `SELECT COUNT(*) GameID, `
  const allWins = []
  let fristAddition = true
  for (let i = 0; i < Object.keys(gamesList).length; i++) {
    if (gamesList.recordset[i].Placement === 1) {
      if(fristAddition === true){
        sqlCode += `SUM(CASE WHEN GameID = '${gamesList.recordset[i].GameID}' AND UserID = '${userID}' THEN 1 ELSE 0 END)`
        fristAddition = false
      }
      else{
        sqlCode += `, SUM(CASE WHEN GameID = '${gamesList.recordset[i].GameID}' AND UserID = '${userID}' THEN 1 ELSE 0 END)`
      }
    }
  }
  if (fristAddition === false) {
    sqlCode += ` FROM [dbo].[Guess] GROUP BY GameID;`
  }
  else {
    sqlCode += `FROM [dbo].[Guess] WHERE UserID='0';`
  }
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