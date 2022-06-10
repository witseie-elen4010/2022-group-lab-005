const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const jsonParser = bodyParser.json()
const { getMode, changeMode, changePassword } = require('../services/settingsDb.cjs')
const { getUserGames, getUserStats, getUserGuesses } = require('../services/matchHistory.cjs')
const { getUserFriends, getFriendUser, getUserPendingFriends, getUserFriendRequests, addFriend, updateFriend } = require('../services/friendsDb.cjs')

const userRouter = express.Router()

userRouter.get('/api/DarkModeData', async function (req, res) {
  const username = req.query.usernameInput
  getMode(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.get('/stats', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'statistics.html'))
})

userRouter.get('/match', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'matchHistory.html'))
})

userRouter.get('/get/games', function (req, res) {
  const username = req.query.user
  getUserGames(username).then(
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

userRouter.get('/get/match', function (req, res) {
  const game = req.query.game
  getUserGuesses(game).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.get('/settings', function (req, res) { // works
  res.sendFile(path.join(__dirname, '../views', 'settings.html'))
})

userRouter.post('/changeMode', jsonParser, async function (req, res) { // ?
  const username = req.body.usernameInput
  const darkMode = req.body.darkModeInput

  // console.log(`Server received: ${darkMode}`)

  changeMode(darkMode, username).then(
    (result) => {
      res.send(JSON.stringify({ message: `${darkMode} has been saved to the database` }))
    }
  ).catch(console.error)
})

userRouter.post('/updatePassword', jsonParser, async function (req, res) { // ?
  const username = req.body.usernameInput
  const password = req.body.passwordInput

  // console.log(`Server received: ${password}`)

  changePassword(password, username).then(
    (result) => {
      res.send(JSON.stringify({ message: `${password} has been saved to the database` }))
    }
  ).catch(console.error)
})

userRouter.get('/friends', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'friends.html'))
})
// the two functions below together will return User's friends
userRouter.get('/get/friends', function (req, res) {
  const username = req.query.usernameInput
  getUserFriends(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.get('/get/friendUser', function (req, res) {
  const username = req.query.usernameInput
  getFriendUser(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.get('/get/pending', function (req, res) {
  const username = req.query.usernameInput
  getUserPendingFriends(username).then(
    (result) => {
      res.send(result)
    }
  ).catch(console.error)
})

userRouter.get('/get/friendRequest', function (req, res) {
  const username = req.query.usernameInput
  getUserFriendRequests(username).then((result) => {
    res.send(result)
  })
})

userRouter.get('/get/addFriend', function (req, res) {
  const username = req.query.usernameInput
  const friend = req.query.friendInput
  addFriend(username, friend).then((result) => {
    res.send({ Status: result })
  })
})

userRouter.get('/get/updateFriend', function (req, res) {
  const username = req.query.usernameInput
  const friend = req.query.friendInput
  const acceptFriend = req.query.acceptInput

  updateFriend(username, friend, acceptFriend).then((result) => {
    res.send({ updateFriendRequest: result })
  })
})

module.exports = userRouter
