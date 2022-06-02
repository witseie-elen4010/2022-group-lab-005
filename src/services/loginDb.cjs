'use strict'
const { get } = require('./poolManagement.cjs')
// import {JSEncrypt} from 'jsencrypt'

// const { JSDOM } = require('jsdom');
// const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
// const { window } = jsdom;
// global.window = window;
// global.document = window.document;
// global.navigator ={userAgent: 'node.js'};

// global.navigator = { appName: 'protractor' };

// global.window = {}; 
// const {JSEncrypt} = require('../node_modules/jsencrypt/bin/jsencrypt')
// // const JSEncrypt = require('../node_modules/jsencrypt/bin/jsencrypt.min.js')
// // import * as JSEncrypt from '../node_modules/jsencrypt/bin/jsencrypt'
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.window = window;
global.document = window.document;
global.navigator ={userAgent: 'node.js'};

const JSEncrypt  = require('jsencrypt')

async function LogIn (username, password) {

  const decryptedPassword = decryptMessage(password)
  const sqlCode = `SELECT Password FROM Users WHERE Username = '${username}'`
  return new Promise((resolve, reject) => {
    //validate username input, password does not need to be validated due to base64 format from encryption
    if (username === '') {
      resolve('Please input a username')
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
              const decryptedDatabaseMessage = decryptMessage(obj.Password)
              if (decryptedDatabaseMessage === decryptedPassword ) {//this compares the two decrpted messages
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
  const sqlCodeCheckUserExist = `SELECT Password FROM Users WHERE Username = '${username}'`
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

    if (/^[a-zA-Z0-9]+$/.test(username) === false) {
      resolve('Please input a valid username')
    } 
    
    get('default').then(
      (pool) => pool.request().query(sqlCodeCheckUserExist).then( //first query to see if the inputed username exists
        (result) => {
          const list = JSON.stringify(result.recordset[0])
          try {
            if (list === undefined) { // If this is true, then the username does not exist.
              //if username does not exist it will insert new into database
              //this is the actual sql insert, it will insert the username and password onto the database
              get('default').then(
                (pool) => pool.request().query(sqlCode).then(
                  () => {
                    resolve()
                  }
                ).catch(reject)
              ).catch(reject)
              
              resolve("Registration completed")
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

function decryptMessage(encrypted){
  //get private key with env file
  const private_key = process.env.private_key
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(private_key)
  //decrypt message with private key and return
  const decrypted = decrypt.decrypt(encrypted)
  return decrypted
}
module.exports = {LogIn,registerUser}
