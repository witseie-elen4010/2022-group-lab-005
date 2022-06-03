'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getMode: async function getMode (user) {
    const pool = await get('default')

    // Get dark mode setting for specific user
    const mode = await pool.request().query("SELECT DarkMode FROM [dbo].[UserSettings] WHERE ID = '1'")

    if (mode.recordset[0].DarkMode === true) {
      return 'true'
    } else {
      return 'false'
    }
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
