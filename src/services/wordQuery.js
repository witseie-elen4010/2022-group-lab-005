'use strict'
const { resolve } = require('path')
const { get } = require('./poolManagement')

async function createWord (word) {
  return new Promise((resolve, reject) => {
    const sqlCode = `INSERT INTO [HazardaGuess_db].[dbo].[WordLog] (Word) VALUES ('${word}');`
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }
      )// .catch(reject(console.error)) // TODO: find out why this is causing the server to crash
    )// .catch(reject(console.error)) // TODO: find out why this is causing the server to crash
  })
}

async function checkWord (gameId) {
  // Gets the word to guess from then checks with the guessed word
  const sqlCode = `SELECT WordToGuess FROM [dbo].[Game] WHERE GameID='${gameId}';`
  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result.recordset[0].WordToGuess)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

module.exports = {
  createWord: createWord,
  checkWord: checkWord,
  makeGuess: async function makeGuess(word, gameId){
    return new Promise((resolve, reject) => {
    if (/^[a-zA-Z]+$/.test(word) === true & word.length === 5) {
      try {
        console.log('hello')
        createWord(word).then(data => {
          // Now we check that the number of rows affected is equal to one since only
          // one row must be added. If this is anything but one, then an error has occurred.
          const numRows = JSON.parse(JSON.stringify(data)).rowsAffected.at(0)
          
          if (numRows === 1) {
            checkWord(1).then((check) => {
              if (check === word) { // Displays if the guessed word is correct
                console.log(`${word} has been saved to the database, you guess the correct word!`)
                resolve(JSON.stringify({ message: `${word} has been saved to the database, you guess the correct word!` }))
              } else {
                resolve(JSON.stringify({ message: `${word} has been saved to the database, you NONCE that's the wrong word! D:<` }))
              }
            }).catch(reject)
          } else {
            resolve(JSON.stringify({ message: `There was an error saving ${word} to the database` }))
          }
        })
      } catch (err) {
        console.log(err)
      }
    } else {
      resolve(JSON.stringify({ message: `${word} is invalid. It must be 5 letters long and only be alphabetical` }))
    }
  })
  }
}
