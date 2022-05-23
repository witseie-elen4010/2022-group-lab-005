'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const mainRouter = express.Router()

let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: true });

const { createWord } = require('./services/wordQuery')

mainRouter.use(bodyParser.urlencoded({ extended: false }));
mainRouter.use(bodyParser.json());

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
  console.log(`Server received: ${word}`)

  if (/^[a-zA-Z]+$/.test(word) === true & word.length === 5) {
    const result = await createWord(word)
    res.send(JSON.stringify({'message' : `${word} has been saved to the database`}));
  } else {
    res.send(JSON.stringify({'message' : `${word} is invalid. It must be 5 letters long and only be alphabetical`}))
  }
})

module.exports = mainRouter
