'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
  getMode: async function getMode(username) {
    // Get dark mode setting for specific user
    const modeRequest = `SELECT isDarkmode FROM Settings WHERE Username = '${username}'`
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

  changeMode: async function changeMode(DarkMode, username) {
    // update users table if dark mode has changed
    const sqlCode = `UPDATE Settings SET isDarkmode = '${DarkMode}' WHERE Username = '${username}'`
    return new Promise((resolve, reject) => {
      console.log(sqlCode)
      get('default').then(
        (pool) => pool.request().query(sqlCode).then(
          (result) => { resolve(JSON.stringify({ message: `${DarkMode} has been saved to the database` })) }
        ).catch(console.error)
      ).catch(console.error)
    })
  },

 changePassword: async function changePassword(password, username) {
    // update users table if dark mode has changed
    const sqlCode = `UPDATE Users SET Password = '${password}' WHERE Username = '${username}'`
    return new Promise((resolve, reject) => {
      console.log(sqlCode)
      get('default').then(
        (pool) => pool.request().query(sqlCode).then(
          (result) => { resolve(JSON.stringify({ message: `${password} has been saved to the database` })) }
        ).catch(console.error)
      ).catch(console.error)
    })
  }
}
