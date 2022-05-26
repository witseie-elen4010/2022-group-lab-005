'use strict'
require('dotenv').config()
// const { Connection, Request } = require('tedious')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mainRouter = require('./src/mainRoutes')
//NO TOUCHY!! const { socketConnection } = require('./services/soc')

// app.use('/', mainRouter)

app.use(express.static('public'))
// app.use('/public', express.static(__dirname + '/public'))
app.use('/src/public', express.static(__dirname + '/src/public'))
//NO TOUCHY!! app.use('/node_modules', express.static(path.join(__dirname, 'node_modules/')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/services', express.static(path.join(__dirname, 'src/services')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//NO TOUCHY!!
/*
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

io.on('hi', (socket) => {
  console.log('User wants to join a game')
})

server.listen(25565, () => {
  console.log('Socket.io listening on 25565')
})
*/

app.use(mainRouter)
// app.use('/public', express.static(__dirname + '/public'))

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
