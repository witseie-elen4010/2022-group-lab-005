'use strict'
const { get } = require('./poolManagement')

module.exports = {
  example: async function example (user) {
    const pool = await get('default')

    // Get dark mode setting for specific user
    const mode = await pool.request().query("SELECT Darkmode FROM User_Details WHERE Username = '" + user + "'")

    if (mode.recordset[0].Darkmode == true) {
      return 'true'
    } else {
      return 'false'
    }
  },

  // This should go in its own file, not in testDB which is for testing the DB and pool.
  changeMode: async function changeMode (Darkmode) {
    // update users table if dark mode has changed
    const sqlCode = `UPDATE dbo.User_Details SET DarkMode = '${Darkmode}' WHERE Username = 'user'`

    console.log(sqlCode)
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => { return result }
      ).catch(console.error)
    ).catch(console.error)
  }
}
