require('dotenv').config()
const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER, // update me
      password: process.env.DB_PASSWORD // update me
    },
    type: "default" 
  },
  server: process.env.DB_HOST, // update me
  options: {
    database: process.env.DB_NAME, //update me
    encrypt: true
  }
};
const connection = new Connection(config);


const path = require('path') // used later in the exercise
const express = require('express')
const app = express()
const mainRouter = require('./src/mainRoutes')

app.use('/public', express.static(__dirname + '/public'));

app.use(mainRouter)

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)

