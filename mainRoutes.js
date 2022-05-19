const path = require('path')
const express = require('express')
const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
    res.send('Hello World. I\'m a Node app.')
})
mainRouter.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
})
mainRouter.get('/LogIn', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'))
})
module.exports = mainRouter