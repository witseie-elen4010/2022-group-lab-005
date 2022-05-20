const path = require('path')
const express = require('express')
const mainRouter = express.Router()

mainRouter.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
 })

mainRouter.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
})
mainRouter.get('/settings', function (req, res) {
    res.sendFile(path.join(__dirname, 'settings.html'))
    //res.sendFile(path.join(__dirname, 'settings','settings.js'))
})
module.exports = mainRouter




