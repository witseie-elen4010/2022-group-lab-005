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
    console.log(sqlCode)
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => { return result }
      ).catch(console.error)
    ).catch(console.error)
  }
}
