'use strict'

const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const app = express()
const mainRouter = require('./mainRoutes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(mainRouter)

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
