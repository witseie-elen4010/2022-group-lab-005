'use strict'

const path = require('path')
const express = require('express')
const mainRouter = express.Router()

mainRouter.get('/', function (req, res) {
    res.send('Hello World. I\'m a Node app.')
})

mainRouter.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

mainRouter.get('/test', function (pos, req) {
    req.sendFile(path.join(__dirname, 'views', 'test.html'))
})

mainRouter.post("/myWord", function (req, res) {
    const wordToLog = req.body.wordField

    console.log(wordToLog)

    // The word must only contain alphabetical elements. It must also have a length of 5.
    if (/^[a-zA-Z]+$/.test(wordToLog) === true & wordToLog.length === 5) {
      res.send(`Saved <b>${wordToLog}</b> to the database.`)
    } else {
      res.send('Invalid word. Word must be 5 letters long and only be alphabetical')
    }
  })

module.exports = mainRouter
