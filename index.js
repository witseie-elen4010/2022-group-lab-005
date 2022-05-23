
require('dotenv').config()
const { Connection, Request } = require('tedious')
'use strict'


const path = require('path') // used later in the exercise


const bodyParser = require('body-parser')
// const path = require('path')

const express = require('express')
const app = express()
const mainRouter = require('./mainRoutes.js')

app.use('/', mainRouter)

app.use('/public', express.static(__dirname + '/public'))

app.use(
  '/css',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))
)
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
)
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'))
)
app.use('/services', express.static(path.join(__dirname, 'src/services')))
=======
const mainRouter = require('./mainRoutes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(mainRouter)
app.use('/public', express.static(__dirname + '/public'))

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
