const { get } = require('./poolManagement')

module.exports = {
  example: async function example () {
    const pool = await get('default')
    return pool.request().query('SELECT * FROM [dbo].[Persons]')
  },

  createPerson: async function createPerson (personID, lastName, firstName, address, city) {
    // make sure that any items are correctly URL encoded in the connection string
    const sqlCode = `INSERT INTO dbo.Persons(PersonID, LastName, FirstName, Address, City)
        VALUES ('${personID}', '${lastName}','${firstName}','${address}', '${city}');`
=======
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
