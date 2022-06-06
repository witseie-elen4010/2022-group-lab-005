'use strict'
const { get } = require('./poolManagement.cjs')
const { resolve } = require('path')

async function LogIn (username, password) {
  const sqlCode = `SELECT Password FROM Users WHERE Username = '${username}'`
  return new Promise((resolve, reject) => {
    // validate username input, password does not need to be validated due to base64 format from encryption
    if (username === '' & password === '') {
      resolve('Please input a username and password')
    } else if (username === '') {
      resolve('Please input a username')
    } else if (password === '') {
      resolve('Please input a password')
    }

    if (/^[a-zA-Z0-9]+$/.test(username) === false) {
      resolve('Please input a valid username')
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

async function registerUser (username, password) {
  const sqlCodeCheckUserExist = `SELECT Password FROM Users WHERE Username = '${username}'`
  const sqlCode = `INSERT INTO Users (Username, Password, SettingID)
  VALUES ('${username}','${password}','1');`// default dark mode off
  return new Promise((resolve, reject) => {
    if (username === '' & password === '') {
      resolve('Please input a username and password')
    } else if (username === '') {
      resolve('Please input a username')
    } else if (password === '') {
      resolve('Please input a password')
    }

    if (/^[a-zA-Z0-9]+$/.test(username) === false) {
      resolve('Please input a valid username')
    }

    get('default').then(
      (pool) => pool.request().query(sqlCodeCheckUserExist).then( // first query to see if the inputed username exists
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

              resolve('Registration completed')
            } else {
              resolve('Account exists already.')
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

module.exports = { LogIn, registerUser }
