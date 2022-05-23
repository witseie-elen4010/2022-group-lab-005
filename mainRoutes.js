'use strict'
const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const bodyParser = require('body-parser')
const {example, changeMode} = require('./public/testDB')


mainRouter.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
 })

mainRouter.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'about.html'))
})


mainRouter.get('/api/DarkModeData', async function (req, res) {
    const result = await example()
    res.send(result)
})

 mainRouter.get('/settings', function (req, res) {
    
     res.sendFile(path.join(__dirname, 'settings.html'))

 })

 module.exports = mainRouter