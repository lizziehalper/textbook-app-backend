// 'use strict';

// Require all necessary modules
const mongoose = require('mongoose');
const models = require('./models/models');

const User = models.User;
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Express set up
const app = express();
app.use(bodyParser.json());

// Mongoose configuration
// When there is an error, run this function:
mongoose.connection.on('error', () => {
  console.log('Could not connect to database');
});

mongoose.connection.on('connected', () => {
  console.log('Success, connected to database');
});

mongoose.connect(process.env.MONGODB_URI);

// session setup
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'secret',
  store: new MongoStore({
    mongooseConnection: mongoose.connection.on('connected', () => {
      console.log('NEW SESSION');
    }),
  }),
}));

// hashing
const crypto = require('crypto');

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// passport local strategy
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (hashPassword(password) !== user.hashedPassword) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));

// passport.use(new LocalStrategy((username, password, done) => {
//   User.findOne({ username }, (err, user) => {
//     if (err) { return done(err); }
//     if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     if (!user.validPassword(password)) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     return done(null, user);
//   });
// }));

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize());
app.use(passport.session());

// require in my routes
const apiroutes = require('./apiroutes');

app.use('/', apiroutes);

// start my server
app.listen(process.env.PORT || '3000', () => {
  console.log('The server is up!');
});
