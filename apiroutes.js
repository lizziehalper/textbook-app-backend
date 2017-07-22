const express = require('express');

const router = express.Router();
const models = require('./models/models.js');
// IMPORTING ALL MODELS
const User = models.User;
const Book = models.Book;
// const passport = require('passport');
// hashing
const crypto = require('crypto');

const isEmail = require('is-email');

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// ROUTES:


router.post('/register', (req, res) => {
  const isValidUser = (user) => {
    if (!user.fname) {
      return 'Please enter your first name.';
    }
    if (!user.lname) {
      return 'Please enter your last name.';
    }
    if (!isEmail(user.email)) {
      return 'Please enter a valid email address.';
    }
    if (!user.username) {
      return 'Please enter a username.';
    }
    if (!user.hashedPassword) {
      return 'Please enter a password.';
    }
    // User.find({ email: user.email })
    // .exec((err, email) => {
    //   if (err) {
    //     return err;
    //   }
    //   if (email) {
    //     return 'There is already an account associated with this email address.';
    //   }
    //   return true;
    // });
    return true;
  };
  const newUser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    username: req.body.username,
    email: req.body.email,
    hashedPassword: hashPassword(req.body.password),
    library: [],
  });
  if (isValidUser(newUser) === true) {
    newUser.save((err) => {
      if (err) {
        res.json({ failure: 'failed to save new user' });
      } else {
        res.json({ newUser });
        // res.redirect('/api/registration')
        console.log('saved the new user!!');
      }
    });
  }
});

// gets the user, gets the user's library
router.post('/', (req, res) => {
  const userId = req.body.id;
  User.findById(userId)
  .populate('library')
  .exec((err, user) => {
    if (err) {
      res.json({ failure: 'failed to find user' });
    }
    console.log(user);
    res.json({ success: true, books: user.library });
  });
});

router.get('/explore', (req, res) => {
  Book.find()
  .exec((err, books) => {
    res.json({ success: true, library: books });
  });
});

router.post('/read', (req, res) => {
  const bookId = req.body.id;
  Book.findById(bookId, (err, book) => {
    if (err) {
      res.json({ failure: 'failed to find book' });
    }
    res.json({ success: true, text: book });
  });
});

// gets the array of books
// router.get('/explore', (req,res) => {
//
// })

module.exports = router;
