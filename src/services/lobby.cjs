'use strict'
const { get } = require('./poolManagement.cjs')

async function createGame (input) {
  return new Promise((resolve, reject) => {
    let sqlCode = ''
    if (input.gameMode === 1) {
      sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
                 SELECT TOP 1 '1', Word, '${input.numPlayers}'
                 FROM [dbo].[Vocabulary]
                 ORDER BY NEWID();
                 SELECT TOP 1 [dbo].[Game].ID, [dbo].[Game].NumPlayers, [dbo].[Game].WordToGuess, [dbo].[Game].[GameType]
                 FROM [dbo].[Game]
                 ORDER BY [dbo].[Game].ID DESC;`
    } else { // More modes can be added here in future, this conversion to int could be done initially. ie Player choosing standard sends 1
      // sqlCode = `INSERT INTO [dbo].[Game] (GameType, WordToGuess, NumPlayers)
      // SELECT TOP 1 '${input.gameMode}', '${input.customWord}', '${input.numPlayers}';`
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

async function getGameInformation (gameID) {
  const sqlCode = `SELECT TOP 1 [dbo].[Game].ID, [dbo].[Game].NumPlayers, [dbo].[Game].WordToGuess,[dbo].[Game].[GameType]
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

async function getPlayerNames (gameID) {
  const sqlCode = `SELECT usr.Username 
  FROM [dbo].[Users] AS usr
  INNER JOIN [dbo].[UserGame] AS usrGame
  ON  usrGame.Username = usr.Username
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

async function addPlayerToGame (gameID, username) {
  const sqlCode = `INSERT INTO [dbo].[UserGame] (Username, GameID)
                 SELECT '${username}', '${gameID}';`

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

async function removePlayerFromGame (gameID, username) {
  const sqlCode = `DELETE FROM [dbo].[UserGame]
  WHERE Username = '${username}' AND GameID = ${gameID};`

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

async function logPlayersGuess (guess, gameID, username) {
  const sqlCode = `INSERT INTO [dbo].[Guess] (Word, TimeStamp, GameID, Username)
VALUES ('${guess}', SYSDATETIME(), ${gameID}, '${username}');`
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

async function logWinningPlayer (gameID, username) {
  const sqlCode = `UPDATE [dbo].[Game]
  SET WhoWon = '${username}'
  WHERE ID = ${gameID};`

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

async function getGameGuesses (gameID) {
  // Returns the guesses made by all the users for a particular game.
  // The results are ordered by increasing timestamp values.
  const sqlCode = `SELECT WORD, TimeStamp, Username FROM [dbo].[Guess]
  WHERE GameID = ${gameID}
  ORDER BY TimeStamp ASC`
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

async function isGuessAWord (word) {
  return new Promise((resolve, reject) => {
    const wordTrimmed = word.toLowerCase().substring(0, 5)

    const sqlCode = `SELECT * FROM [dbo].[Vocabulary]
  WHERE Word = '${wordTrimmed}'`

    if (/^[a-zA-Z]+$/.test(wordTrimmed) === true) {
      get('default').then(
        (pool) => pool.request().query(sqlCode).then(
          (result) => {
            if (result.rowsAffected[0] >= 1) { // There should only be one result but we just add this in the event that a word is part of another word or something like that
              resolve(true)
            } else {
              resolve(false)
            }
          }
        ).catch(reject)
      ).catch(reject)
    } else {
      reject(new Error('Word contains invalid characters'))
    }
  })
}

module.exports = { createGame, getGameInformation, getPlayerNames, addPlayerToGame, removePlayerFromGame, logPlayersGuess, logWinningPlayer, getGameGuesses, isGuessAWord }
