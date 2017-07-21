const express = require('express');

const router = express.Router();
const models = require('./models/models.js');
// IMPORTING ALL MODELS
const User = models.User;
const Book = models.Book;
const passport = require('passport');
// hashing
const crypto = require('crypto');

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// ROUTES:
// router.post('/login', passport.authenticate(('local'), (req, res) => {
//   const username = req.body.username;
//   User.findOne({ username }, (err, user) => {
//     if (err) {
//       console.log(err);
//     }
//     // res.json({ success: true,
//     //   user: {
//     //     username: user.username,
//     //     fname: user.fname,
//     //     lname: user.lname,
//     //     library: user.library,
//     //   },
//     // });
//     // res.redirect(200, '/');
//   });
// }));

router.post('/login', passport.authenticate('local'), (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
  res.json({ success: true,
    user: {
      id: req.user.id,
      fname: req.user.fname,
      lname: req.user.lname,
      username: req.user.username,
      email: req.user.email,
      library: req.user.library,
    },
  });
});

router.post('/register', (req, res) => {
  const newUser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    username: req.body.username,
    email: req.body.email,
    hashedPassword: hashPassword(req.body.password),
    library: [],
  });
  newUser.save((err) => {
    if (err) {
      res.json({ failure: 'failed to save new user' });
    } else {
      res.redirect('/login');
      // res.redirect('/api/registration')
      console.log('saved the new user!!');
    }
  });
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
