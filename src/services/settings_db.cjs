'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getMode: async function getMode (username) {
    // Get dark mode setting for specific user
    const modeRequest = `SELECT isDarkmode FROM Settings WHERE Username = 'robyn'`
    return new Promise((resolve, reject) => {
      get('default').then(
        (pool) => pool.request().query(modeRequest).then(
          (result) => {
            resolve(result)
          }
        ).catch(reject)
      ).catch(reject)
    })
  },

  // This should go in its own file, not in testDB which is for testing the DB and pool.
  changeMode: async function changeMode (DarkMode, username) {
    // update users table if dark mode has changed
    const sqlCode = `UPDATE Settings SET isDarkmode = '${DarkMode}' WHERE Username = '${username}'`

    console.log(sqlCode)
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => { return result }
      ).catch(console.error)
    ).catch(console.error)
  }
}
