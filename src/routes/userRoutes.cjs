const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()
const { getMode, changeMode } = require('../services/settings_db.cjs')
const { getBackground } = require('../services/background_db.cjs')
const { getUserGames, getUserStats} = require('../services/matchHistory.cjs')

const userRouter = express.Router()

userRouter.get('/api/DarkModeData', async function (req, res) {
    const result = await getMode('user')
    res.send(result)
})

userRouter.get('/stats', function (req,res){
    res.sendFile(path.join(__dirname, '../views', 'Statistics.html'))
})

userRouter.get('/get/games', function (req, res) {
    getUserGames(1).then(
        (result) => {
            res.send(result)
        }
    ).catch(console.error)
})

userRouter.get('/get/stats', function(req,res){
    getUserStats(1).then(
        (result) => {
            res.send(result)
        }
    ).catch(console.error)
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