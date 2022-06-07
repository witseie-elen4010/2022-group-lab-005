'use strict'
const { get } = require('./poolManagement.cjs')

async function getUserFriends (username) {
  // Returns all guesses made in games the user won
  const sqlCode = "SELECT Invitee FROM [dbo].[Friends] WHERE (Inviter = '" + username + "'OR Invitee = '" + username + "') AND Status = 'isFriend';"
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
  const sqlCode = "SELECT Invitee FROM [dbo].[Friends] WHERE (Inviter = '" + username + "'OR Invitee = '" + username + "') AND Status = 'pending';"
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
  const sqlCodeCheckFriendExist = `SELECT Status FROM [dbo].[Friends] WHERE (Inviter = '${username}' AND Invitee = '${friend}') OR (Inviter = '${friend}' AND Invitee = '${username}');`
  const sqlCode = `INSERT INTO [dbo].[Friends] (Inviter, Invitee, Status)
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
