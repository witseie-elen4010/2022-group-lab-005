'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const LogIn = require('./services/login_db')
const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
    res.send('Hello World. I\'m a Node app.')
})

mainRouter.get('/Login', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'))
})

mainRouter.use(bodyParser.urlencoded({ extended: false }));
mainRouter.use(bodyParser.json());

mainRouter.post('/log', async function(req, res){
    const username = req.body.usernameInput
    const password = req.body.passwordInput

    //const result = LogIn(username, password).then(console.log(result))
    const result = await LogIn(username, password)
    //async () => await res.send({"loggedInOrNot": (LogIn(username, password))})
    res.send({"loggedInOrNot": result})
})
module.exports = mainRouter