require('dotenv').config()
const { Connection, Request } = require('tedious')

const path = require('path') // used later in the exercise
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

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
