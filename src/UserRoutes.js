const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {LogIn} = require('./services/LogInDB')
const mainRouter = express.Router()
mainRouter.get('/', function (req, res) {
    res.send('Hello World. I\'m a Node app.')
})
mainRouter.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
})
mainRouter.get('/Login', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'))
})

mainRouter.use(bodyParser.urlencoded({ extended: false }));
mainRouter.use(bodyParser.json());
mainRouter.post('/send', async function(req, res){
    const result = await LogIn(req.body.username, req.body.password)
    res.send(result)
})
module.exports = mainRouter