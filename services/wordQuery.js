const { get } = require('./poolManagement')

module.exports = {
  createWord: async function createWord (word) {
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
  },
  checkWord: async function checkWord(word, gameId) {
    // Gets the word to guess from then checks with the guessed word
    const sqlCode = `SELECT WordToGuess FROM [dbo].[Game] WHERE GameID='${gameId}';`
    return new Promise((resolve, reject) => {
        get('default').then(
            (pool) => pool.request().query(sqlCode).then(
                    (result) => {
                        console.log(result.recordset[0].WordToGuess)
                        resolve(word === result.recordset[0].WordToGuess);
                    }
                ).catch(reject)
        ).catch(reject)
    })
}
}
