"use strict";

// Require all necessary modules
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');

// Mongoose configuration
// When there is an error, run this function:
mongoose.connection.on('error', function() {
  console.log('Could not connect to database')
})

mongoose.connection.on('connected', function() {
  console.log('Success, connected to database')
})

mongoose.connect(process.env.MONGODB_URI);

// express application configuration
// Creates the application
var app = express()
app.use(bodyParser.json())

// require in my routes
var apiroutes = require('./apiroutes')
app.use('/api', apiroutes)

// start my server
app.listen(process.env.PORT || '3000', function() {
  console.log('Yee, the server is up!');
})
