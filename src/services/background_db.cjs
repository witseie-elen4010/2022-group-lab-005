'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getBackground: async function getBackground (username) {
    // send query to database
    const modeRequest = `SELECT Background FROM Settings WHERE Username = '${username}';` 
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

  changeBackground: async function changeBackground (Background, username) {
    const sqlCode = `UPDATE Settings SET Background  = '${Background}' WHERE Username = '${username}';`
    return new Promise((resolve, reject) => {
      console.log(sqlCode)
      get('default').then(

        // save new background in database
        (pool) => pool.request().query(sqlCode).then(
          (result) => {
            resolve(JSON.stringify({ message: `${Background} has been saved to the database` }))
          }
        ).catch(console.error)
      ).catch(console.error)
    })
  }

}
