'use strict'
const { get } = require('./poolManagement.cjs')


async function getUserFriends(username) {
  // Returns all guesses made in games the user won
  const sqlCode = "SELECT Friend FROM [dbo].[Friends] WHERE Username = '" + username + "' ;"
  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

module.exports = {
    getUserFriends: getUserFriends,
}