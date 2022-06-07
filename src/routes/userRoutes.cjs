const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()
const { getMode, changeMode } = require('../services/settings_db.cjs')
const { getBackground } = require('../services/background_db.cjs')
const { getUserGames, getUserStats } = require('../services/matchHistory.cjs')
const { getUserFriends, getUserPendingFriends, getUserFriendRequests, addFriend } = require('../services/friendsDb.cjs')

const userRouter = express.Router()

userRouter.get('/api/DarkModeData', async function (req, res) {
  const result = await getMode('user')
  res.send(result)
})

userRouter.get('/stats', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'Statistics.html'))
})

userRouter.get('/get/games', function (req, res) {
  getUserGames(1).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.get('/get/stats', function (req, res) {
  const username = req.query.user
  getUserStats(username).then(
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

userRouter.get('/friends', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'friends.html'))
})

userRouter.post('/post/friends', function (req, res) {
  const username = req.body.usernameInput
  getUserFriends(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.post('/post/pending', function (req, res) {
  const username = req.body.usernameInput
  getUserPendingFriends(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.post('/post/friendRequest', function (req, res) {
  const username = req.body.usernameInput
  getUserFriendRequests(username).then((result) => {
    res.send(result)
  })
})

userRouter.post('/post/addFriend', function (req, res) {
  const username = req.body.usernameInput
  const friend = req.body.friendInput
  addFriend(username, friend).then((result) => {
    res.send({ Status: result })
  })
})
module.exports = userRouter
