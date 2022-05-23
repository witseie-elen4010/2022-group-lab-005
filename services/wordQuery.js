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
  }
}
