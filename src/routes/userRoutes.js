const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()
const { getMode, changeMode } = require('../services/settings_db')
const { getBackground } = require('../services/background_db')

const userRouter = express.Router()

userRouter.get('/api/DarkModeData', async function (req, res) {
    const result = await getMode('user')
    res.send(result)
})

userRouter.get('/api/BackgroundData', async function (req, res) {
    const result = await getBackground('1')
    res.send(result)
})

userRouter.get('/settings', function (req, res) { // works
    res.sendFile(path.join(__dirname, '../views', 'settings.html'))
})

userRouter.post('/changeMode', jsonParser, async function (req, res) { // ?
    const darkMode = req.body.darkMode
    console.log(`Server received: ${darkMode}`)

    const result = await changeMode(darkMode)
    res.send(JSON.stringify({ message: `${darkMode} has been saved to the database` }))
})

module.exports = userRouter