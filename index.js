'use strict'
const path = require('path') // used later in the exercise
const express = require('express')
const app = express()
const mainRouter = require('./mainRoutes')

app.use(mainRouter)
app.use('/public', express.static(__dirname + '/public'));

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)

