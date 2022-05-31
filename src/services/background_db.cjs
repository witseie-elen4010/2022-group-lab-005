'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getBackground: async function getMode (id) {
    // connect to database using pool management
    const pool = await get('default')

    // send query to database
    const background = await pool.request().query("SELECT Background FROM [dbo].[UserSettings] WHERE ID = '" + id + "'")

    // return query result
    if (background.recordset[0].Background === 'Mountains') {
      return 'Mountains'
    } else {
      if (background.recordset[0].Background === 'Forest') {
        return 'Forest'
      } else {
        if (background.recordset[0].Background === 'Beach') {
          return 'Beach'
        }
      }
    }
  },

  changeBackground: async function changeBackground (Background, ID) {
    const sqlCode = `UPDATE [dbo].[UserSettings] SET Background  = '${Background}' WHERE ID = '1'`
    return new Promise((resolve, reject) => {
      console.log(sqlCode)
      get('default').then(

        // save new background in database
        (pool) => pool.request().query(sqlCode).then(
          (result) => { resolve(result) }
        ).catch(console.error)
      ).catch(console.error)
    })
  }

}
