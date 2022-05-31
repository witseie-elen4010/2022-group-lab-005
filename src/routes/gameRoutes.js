const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()

const gameRouter = express.Router()

const { createWord, checkWord, makeGuess } = require('../services/wordQuery')
const mainRouter = require('../mainRoutes')

gameRouter.post('/logWord', jsonParser, async function (req, res) { // works
    const word = req.body.wordToLog
    makeGuess(word, 1).then(
        (result) => {
            res.send(result)
        }
    ).catch(console.error)
})

gameRouter.get('/guess', function (pos, req) { // works
    req.sendFile(path.join(__dirname, '../views', 'test.html'))
})

gameRouter.get('/changeBackground', function (pos, req) { 
    req.sendFile(path.join(__dirname, '../views', 'changeBackground.html'))
})



module.exports = gameRouter