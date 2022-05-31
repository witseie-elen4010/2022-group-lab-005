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
    let sqlCode = `SELECT GameID FROM [dbo].[UserGame] WHERE UserID='${userID}'`
    const allWins = []
    for(let i = 0; i < Object.keys(gamesList).length; i++){
        if(gamesList.recordset[i].Placement === 1){
            allWins.push(gamesList.recordset[i].GameID)
        }
    }
    let fristAddition = true
    for(let i = 0; i < allWins.length; i++){
        if(fristAddition === true){
            sqlCode += ` AND (GameID='${allWins[i]}'`
            fristAddition = false
        }
        else{
            sqlCode += ` OR GameID='${allWins[i]}'`
        }
    }
    if(fristAddition === false){
        sqlCode += `);`
    }
    else{
        sqlCode += ` AND GameID='0';`
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
    getUserGames:getUserGames,
    getUserStats:getUserStats
}