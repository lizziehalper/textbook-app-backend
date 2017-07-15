var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');


// Schemas: The outline of how every single document should look
var Schema = mongoose.Schema

// USER SCHEMA: full name, friends list, default picture, userId
var userSchema = new Schema({
  fname: String,
  lname: String,
  friends: Array,
  prof: Object,
  userId: String
})
// TOKEN SCHEMA: userId, token, createdAt
var tokenSchema = new Schema({
  userId: String,
  token: String,
  createdAt: Date
})
// MESSAGE SCHEMA: sent messages, receieved messages, sent time stamp, received time stamp
var messageSchema = new Schema({
  sent: Array,
  received: Array,
  createdAt: Date,

})
// Models: pass the schema as an argument after building schema

var User = mongoose.model('User', userSchema);
var Token = mongoose.model('Token', tokenSchema);
var Message = mongoose.model('Message', messageSchema);


module.exports = {
  User: User,
  Token: Token,
  Message: Message
}
