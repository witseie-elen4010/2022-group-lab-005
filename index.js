'use strict'
require('dotenv').config()

const stdConfig = false

// If stdConfig is true, the code will behave how it used to.
// If it is false, then the code will behave how it used to but with
// the addition of sockets.
if (stdConfig === true) {
  // const { Connection, Request } = require('tedious')
  const path = require('path')
  const bodyParser = require('body-parser')
  const express = require('express')
  const app = express()
  const mainRouter = require('./src/mainRoutes.cjs')

  // app.use('/', mainRouter)

  app.use(express.static('public'))
  // app.use('/public', express.static(__dirname + '/public'))
  app.use('/src/public', express.static(__dirname + '/src/public'))
  app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
  app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
  app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
  app.use('/services', express.static(path.join(__dirname, 'src/services')))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(mainRouter)
  // app.use('/public', express.static(__dirname + '/public'))

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log('Express server running on port', port)
} else {
  const path = require('path')
  const bodyParser = require('body-parser')
  const express = require('express')
  const app = express()

  const http = require('http')
  const server = http.createServer(app)
  const { Server } = require('socket.io')
  const io = new Server(server)

  const mainRouter = require('./src/mainRoutes.cjs')
  // app.use('/', mainRouter)

  app.use(express.static('public'))
  app.use('/src/public', express.static(__dirname + '/src/public'))
  app.use('/socket.io-client', express.static(path.join(__dirname, '/node_modules/socket.io-client')))
  app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
  app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
  app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
  app.use('/services', express.static(path.join(__dirname, 'src/services')))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(mainRouter)
  // app.use('/public', express.static(__dirname + '/public'))

  // Setup the sockets so we can lets the different clients interact through the
  // game server.
  const soc = require('./src/services/socket.cjs')
  soc(io)

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`listening on *:${port}`)
  })
}
