'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getMode: async function getMode (user) {
    const pool = await get('default')

    // Get dark mode setting for specific user
    const modeRequest = `SELECT DarkMode FROM [dbo].[UserSettings] WHERE ID = '1'`
    return new Promise((resolve, reject) => {
      get('default').then(
        (pool) => pool.request().query(modeRequest).then(
          (result) => {
            resolve(result.recordset[0].DarkMode)
          }
        ).catch(reject)
      ).catch(reject)
    })
    
  },

  // This should go in its own file, not in testDB which is for testing the DB and pool.
  changeMode: async function changeMode (DarkMode) {
    // update users table if dark mode has changed
    const sqlCode = `UPDATE [dbo].[UserSettings] SET DarkMode = '${DarkMode}' WHERE ID = '1'`

    console.log(sqlCode)
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => { return result }
      ).catch(console.error)
    ).catch(console.error)
  }
}
