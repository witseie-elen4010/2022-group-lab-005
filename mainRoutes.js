'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const mainRouter = express.Router()

const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({ extended: true })

const { createWord, checkWord } = require('./services/wordQuery')
const { resolve } = require('path')

mainRouter.use(bodyParser.urlencoded({ extended: false }))
mainRouter.use(bodyParser.json())

mainRouter.get('/', function (req, res) {
  res.send('Hello World. I\'m a Node app.')
})

mainRouter.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

mainRouter.get('/test', function (pos, req) {
  req.sendFile(path.join(__dirname, 'views', 'test.html'))
})

mainRouter.post('/logWord', jsonParser, async function (req, res) {
  const word = req.body.wordToLog

  if (/^[a-zA-Z]+$/.test(word) === true & word.length === 5) {
    try {
      createWord(word).then(data => {
        // Now we check that the number of rows affected is equal to one since only
        // one row must be added. If this is anything but one, then an error has occurred.
        const numRows = JSON.parse(JSON.stringify(data)).rowsAffected.at(0)
        // console.log(`Num Rows modified: ${numRows}`) for debug

        if (numRows === 1) {
          checkWord(word, 1).then((check) => {
            if (check) {// Displays if the guessed word is correct
              res.send(JSON.stringify({ 'message': `${word} has been saved to the database, you guess the correct word!` }))
            }
            else {
              res.send(JSON.stringify({ 'message': `${word} has been saved to the database, you NONCE that's the wrong word! D:<` }))
            }
          }).catch(console.error)
        } else {
          res.send(JSON.stringify({ message: `There was an error saving ${word} to the database` }))
        }
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    res.send(JSON.stringify({ message: `${word} is invalid. It must be 5 letters long and only be alphabetical` }))
  }
})

module.exports = mainRouter
