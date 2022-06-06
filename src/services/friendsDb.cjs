'use strict'
const { get } = require('./poolManagement.cjs')

async function getUserFriends (username) {
  // Returns all guesses made in games the user won
  const sqlCode = "SELECT Friend FROM [dbo].[Friends] WHERE (Username = '" + username + "'OR Friend = '" + username + "') AND FriendStatus = 'isFriend';"
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

async function getUserPendingFriends (username) {
  // Returns all guesses made in games the user won
  const sqlCode = "SELECT Friend FROM [dbo].[Friends] WHERE (Username = '" + username + "'OR Friend = '" + username + "') AND FriendStatus = 'pending';"
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

async function addFriend (username, friend) {
  const sqlCodeCheckFriendExist = `SELECT FriendStatus FROM [dbo].[Friends] WHERE (Username = '${username}' AND Friend = '${friend}') OR (Username = '${friend}' AND Friend = '${username}');`

  const sqlCode = `INSERT INTO [dbo].[Friends] (Username, Friend, FriendStatus)
  VALUES ('${username}','${friend}','pending');`
  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCodeCheckFriendExist).then( // first query to see if the inputed username exists
        (result) => {
          const list = JSON.stringify(result.recordset[0])
          try {
            if (list === undefined) { // undefined list shows that username does not exist
              get('default').then(
                (pool) => pool.request().query(sqlCode).then(
                  () => {
                    resolve()
                  }
                ).catch(reject)
              ).catch(reject)
              resolve('Friend request sent')
            } else {
              resolve('The user you are trying to add is either already in on your friend list or pending for approval.')
            }
          } catch (err) {
            console.log(err)
            reject(err)
          }
        }
      ).catch(reject)
    ).catch(reject)
  })
}

module.exports = {
  getUserFriends,
  getUserPendingFriends,
  addFriend
}
