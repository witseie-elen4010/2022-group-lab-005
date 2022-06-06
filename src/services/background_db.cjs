'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getBackground: async function getBackground (id) {
    
    // send query to database
    const modeRequest = `SELECT Background FROM [dbo].[UserSettings] WHERE ID = '1';` 
    return new Promise((resolve, reject) => {
      get('default').then(
        (pool) => pool.request().query(modeRequest).then(
          (result) => {
            resolve(result.recordset[0].Background)
          }
        ).catch(reject)
      ).catch(reject)
    })
  },

  changeBackground: async function changeBackground (Background, ID) {
    const sqlCode = `UPDATE [dbo].[UserSettings] SET Background  = '${Background}' WHERE ID = '1';`
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
