'use strict'
const { get } = require('./poolManagement.cjs')

// return all friends user sent friend request first
async function getUserFriends (username) {
  const sqlCode = `SELECT Invitee FROM [dbo].[Friends] WHERE Inviter = '${username}' AND Status = 'isFriend';`
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

// return all friends friend sent request first
async function getFriendUser (username) {
  // Returns all guesses made in games the user won
  const sqlCode = `SELECT Inviter FROM [dbo].[Friends] WHERE Invitee = '${username}' AND Status = 'isFriend';`
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

// return all pending user friend requests
async function getUserPendingFriends (username) {
  const sqlCode = "SELECT Invitee FROM [dbo].[Friends] WHERE Inviter = '" + username + "' AND Status = 'pending';"
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

// return all pending friend requests user need to accept
async function getUserFriendRequests (username) {
  const sqlCode = "SELECT Inviter FROM [dbo].[Friends] WHERE Invitee = '" + username + "' AND Status = 'pending';"
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

// add a friend
async function addFriend (username, friend) {
  const sqlCodeCheckFriendExist = `SELECT Username FROM [dbo].[Users] WHERE Username = '${friend}'`
  const sqlCodeCheckFriendRelationship = `SELECT Status FROM [dbo].[Friends] WHERE (Inviter = '${username}' AND Invitee = '${friend}') OR (Inviter = '${friend}' AND Invitee = '${username}') ;`
  return new Promise((resolve, reject) => {
    get('default').then(
      // first query if the friend is an user
      (pool) => pool.request().query(sqlCodeCheckFriendExist).then(
        (result) => {
          const list = JSON.stringify(result.recordset[0])
          try {
            if (list !== undefined) {
              get('default').then(
                // this second query will query if the inputted Inviter and invitee 's relationship exist in the database
                (pool) => pool.request().query(sqlCodeCheckFriendRelationship).then(
                  (result) => {
                    const list = JSON.stringify(result.recordset[0])
                    try {
                      if (list === undefined) { // if there is no existing relationship in the database , add new relationship between them
                        const sqlCode = `INSERT INTO [dbo].[Friends] (Inviter, Invitee, Status)
                        VALUES ('${username}','${friend}','pending');`
                        get('default').then(
                          (pool) => pool.request().query(sqlCode).then(
                            () => {
                              resolve()
                            }
                          ).catch(reject)
                        ).catch(reject)
                        resolve('Friend request sent')
                      } else if (JSON.parse(list).Status === 'denied') { // if user have denied the friend request, send again
                        const sqlCode = `UPDATE [dbo].[Friends] SET Inviter ='${username}',Invitee ='${friend}',Status = 'pending' WHERE (Inviter = '${username}' AND Invitee = '${friend}') OR (Inviter = '${friend}' AND Invitee = '${username}');`
                        get('default').then(
                          (pool) => pool.request().query(sqlCode).then(
                            () => {
                              resolve()
                            }
                          ).catch(reject)
                        ).catch(reject)
                        resolve('Friend request sent')
                      } else if (JSON.parse(list).Status === 'pending') {
                        resolve('The user you are trying to add is pending for approval.')
                      } else {
                        resolve('The user you are trying to add is already in your friend list')
                      }
                    } catch (err) {
                      console.log(err)
                      reject(err)
                    }
                  }
                ).catch(reject)
              ).catch(reject)
            } else {
              resolve('The friend you trying to add does not exist')
            }
          } catch (err) {
            console.log(err)
            reject(err)
          }
        }
      ).catch(reject))
  })
}

// called upon accept / decline button press, will update relationship in database accordingly
async function updateFriend (username, friend, acceptOrDecline) {
  let sqlCode = ''
  let accepted = false
  if (acceptOrDecline === 'accept') {
    sqlCode = `UPDATE [dbo].[Friends] SET Status = 'isFriend' WHERE Inviter = '${friend}' AND Invitee = '${username}'`
    accepted = true
  } else {
    sqlCode = `UPDATE [dbo].[Friends] SET Status = 'denied' WHERE Inviter = '${friend}' AND Invitee = '${username}';`
  }
  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        () => {
          if (accepted === true) {
            resolve('Friend request accepted')
          } else {
            resolve('Friend request declined')
          }
        }
      ).catch(reject)
    ).catch(reject)
  })
}

module.exports = {
  getUserFriends,
  getFriendUser,
  getUserPendingFriends,
  getUserFriendRequests,
  addFriend,
  updateFriend
}
