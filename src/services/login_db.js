'use strict'
const { get } = require('./poolManagement')

async function LogIn (username, password) {
  // Gets the word to guess from then checks with the guessed word
  const sqlCode = `SELECT Password FROM Users WHERE Username = '${username}'`
  return new Promise((resolve, reject) => {
    if (username === '' & password === '') {
      resolve('Please input a username and password')
    } else if (username === '') {
      resolve('Please input a username')
    } else if (password === '') {
      resolve('Please input a password')
    }

    if (/^[a-zA-Z0-9]+$/.test(username) === false & /^[a-zA-Z]+$/.test(password) === false) {
      resolve('Username and password are invalid.')
    } else if (/^[a-zA-Z0-9]+$/.test(username) === false) {
      resolve('Please input a valid username')
    } else if (/^[a-zA-Z0-9!@#$%^&]+$/.test(password) === false) { // Why can the password not contain numbers or special characters?
      resolve('Please input a valid password')
    }

    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          const list = JSON.stringify(result.recordset[0])

          try {
            if (list !== undefined) { // If this is true, then the username does not exist.
              const obj = JSON.parse(list)
              if (obj.Password === password) {
                resolve('User is now logged in')
              } else {
                resolve('Check username and password.')
              }
            } else {
              resolve('Account does not exist.')
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


async function registerUser(username, password) {
  const sqlCode = `INSERT INTO Users (Username, Password, SettingID)
  VALUES ('${username}','${password}','1');`//default dark mode off
  return new Promise((resolve, reject) => {
    if (username === '' & password === '') {
      resolve('Please input a username and password')
    } else if (username === '') {
      resolve('Please input a username')
    } else if (password === '') {
      resolve('Please input a password')
    }

    if (/^[a-zA-Z0-9]+$/.test(username) === false & /^[a-zA-Z0-9!@#$%^&]+$/.test(password) === false) {
      resolve('Username and password are invalid.')
    } else if (/^[a-zA-Z0-9]+$/.test(username) === false) {
      resolve('Please input a valid username')
    } else if (/^[a-zA-Z0-9!@#$%^&]+$/.test(password) === false) { // Why can the password not contain numbers or special characters?
      resolve('Please input a valid password')
    }
    
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve("Registration completed")
        }
      ).catch(reject) // TODO: find out why this is causing the server to crash
    ).catch(reject) // TODO: find out why this is causing the server to crash
  })
}
module.exports = {LogIn,registerUser}
