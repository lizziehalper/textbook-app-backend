
var FB = require('fb');

var {FB, FacebookApiException} = require('fb');


var express = require('express');
var router = express.Router()
var models = require('./models/models.js');
var request = require('request');
// IMPORTING ALL MODELS
var User = models.User;
var Token = models.Token;
var Message = models.Message;


// ROUTES:
router.get('/', function(req,res){
  res.redirect('/api/login');
})

// GET: LOGIN
router.get('/login', function(req,res){
  console.log();
})

// POST: LOGIN SCREEN-->
router.post('/login', function(req,res) {
  // store the passed in user input
  var token = req.body.token;

  // access facebook to get relevant info to create a new user
  FB.setAccessToken(token);
  console.log(token);
  FB.api('/me', { fields: ['id', 'first_name', 'last_name', 'friends', 'picture'] }, function (response) {
    if(!response || response.error) {
      console.log(!response ? 'error occurred' : response.error);
      res.json({failure: response.error});
    }else{
      var userId = response.id;
      var fname = response.first_name;
      var lname = response.last_name;
      var friendList = response.friends;
      var prof = response.picture;
      // create new user
      var newUser = new User({
        fname: fname,
        lname: lname,
        friends: friendList,
        prof: prof,
        userId: userId,
        flags: [],
        age: null
      })
    // save the user on our DB with completed user data
      newUser.save(function(err, savedUser){
        if(err){
          res.json({failure: 'failed to save new user'})
        }else{
          res.json({success: true})
          // res.redirect('/api/registration')
          console.log('saved the new user!!')
        }
      })
    }
  });
})


// GET: REGISTRATION VIEW:
router.get('/registration', function(req,res) {
  res.send('The registration view!')
})
// POST: REGISTRATION VIEW
router.post('/registration', function(req,res) {
  FB.api('/me', { fields: ['id'] }, function (response) {
    if(!response || response.error) {
      console.log(!response ? 'error occurred' : response.error);
      return;
    }else{
      var userResponses = req.body.flags;
      var DOB = req.body.DOB;
      var userId = response.id
      // create new user
      User.findBy({userId: userId}, function(err, foundUser){
        if(err){
          res.json({failure: 'Could not find user'})
        }else{
          foundUser.age = DOB;
          userResponses.forEach(function(flag){
            foundUser.flags.push(flag);
          })
          foundUser.save(function(err, updatedUser){
            if(err){
              res.json({failure: 'failed to save new user'})
            }else{
              res.json({success: true})
              // res.redirect('/api/feed')
              console.log('saved the updated user with flags and DOB!!')
            }
          })
        }
      })
    }
  })
})

// GET: FEED VIEW
router.get('/feed', function(req,res) {
  res.send('The feed view!')
})
// POST: FEED VIEW: render all the users, filtered by mutual friends / distance
// router.post('/feed', function(req,res) {
//   FB.api('/me', { fields: ['id'] }, function (response) {
//     if(!response || response.error) {
//       console.log(!response ? 'error occurred' : response.error);
//       return;
//     }else{
//       // Find the user based on the id
//       // grab all the flags that are toggled on
//       // search all users with those same flags and sort them according to same friends
//       var userId = response.id
//       User.findBy({userId: userId}, function(err, foundUser){
//         if(err){
//           res.json({failure: 'Could not find user'})
//         }else{
//           var userFlags = foundUser.flags;
//           User.findBy({flags: userFlags }, function(err, usersWithFlags){
//             if(err){
//               res.json({failure: 'Could not find matching users based on flags'})
//             }else{
//               usersWithFlags
//             }
//           })
//         }
//       })
//     }
// })


// GET: SETTINGS VIEW:
router.get('/settings', function(req,res) {
  res.send('The settings view!')
})
// POST: SETTINGS VIEW:
// router.post('/settings', function(req,res) {
//   FB.api('/me', { fields: ['id'] }, function (response) {
//     if(!response || response.error) {
//       console.log(!response ? 'error occurred' : response.error);
//       return;
//     }else{
// })

// MESSAGES VIEW: INBOX VIEW,
router.get('/messages', function(req,res) {
  res.json({message: 'hello'})
})
// GET --- MESSAGES VIEW:DIRECT MESSAGE VIEW
router.get('/messages/:user_id', function(req,res) {
  res.json({message: 'hello'})
})
// POST --- MESSAGES VIEW:DIRECT MESSAGE VIEW
router.post('/messages/:user_id', function(req,res) {
  res.json({message: 'hello'})
})
//


//
// router.get('/users/logout', function(req,res) {
//   var token = req.query.token;
//
//   Token.remove({token:token}, function(err){
//     if(err){
//       res.json({failure: 'Could not remove token'})
//     }else{
//       res.json({
//         success: true
//       })
//     }
//   })
// })
//
// router.get('/posts', function(req,res){
//   // This request requires authentication -> retrieve and store the token
//   var token = req.query.token;
//   // once authenticated, we want to then retrieve the first 10 posts
//   Token.findOne({token: token}, function(err, matchingToken){
//     if(err){
//       res.send(err)
//     }else{
//       // We want to look through all the posts --> use .find()
//       Post.find(function(err, posts){
//         if(err){
//           res.json({failure: "Could not find posts"})
//         }else{
//           // we want to create a "new" filtered version of posts
//           var filteredPosts = [];
//           var i=0;
//           while(i<posts.length || i<10){
//             filteredPosts.push(posts[i])
//             i++;
//           }
//           res.json({
//             success: true,
//             response: filteredPosts
//           })
//         }
//       })
//     }
//   })
// })
//
// router.get('/posts/:page', function(req,res){
//   var page = req.params.page;
//   var token = req.query.token;
//
//   // Same process as page=1, but modify the while loop to be inside a for loop
//   Token.findOne({token: token}, function(err, matchingToken){
//     if(err){
//       res.send(err)
//     }else{
//       // We want to look through all the posts --> use .find()
//       Post.find(function(err, posts){
//         if(err){
//           res.json({failure: "Could not find posts"})
//         }else{
//           // we want to create a "new" filtered version of posts
//           var filteredPosts = [];
//           var i= (page-1) * 10;
//
//           while(i<posts.length || i<10*page){
//               filteredPosts.push(posts[i]);
//               i++;
//             }
//           res.json({
//             success: true,
//             response: filteredPosts
//           })
//         }
//       })
//     }
//   })
// })
//
// router.post('/posts', function(req,res){
//   // requires authentication -> retrieve token
//   var token = req.query.token;
//   Token.findOne({token:token}, function(err){
//     if(err){
//       res.json('Could not authenticate')
//     }else{
//       //we somehow need to be able to grab the name and id of the user
//       // Look through all the users, matching the one wih an id= token.userId
//       User.findOne({_id: token.userId}, function(err, foundUser){
//         if(err){
//           res.json({Failure: 'Could not find User'})
//         }else{
//           var userName = foundUser.fname +" "+ foundUser.lname;
//           var userId = foundUser.id;
//
//           var newPost = new Post({
//             poster: {
//               name: userName,
//               id: userId
//             },
//             content: req.body.content,
//             likes: [],
//             comments: [],
//             createdAt: new Date()
//           })
//           newPost.save(function(err, savedPost){
//             if(err){
//               res.json({failure: 'Failed to post'})
//             }else{
//               res.json({success: savedPost})
//             }
//           })
//         }
//       })
//     }
//   })
// })
//
// router.get('posts/comments/:post_id', function(req,res){
//   var token = req.query.token;
//   var postId= req.params.post_id;
//
//   Token.findOne({token:token}, function(err){
//     if(err){
//       res.json({failure: "Could not authenticate user"})
//     }else{
//       // In order to retrieve the comments of a specific post,
//       // we need to look up the post based on the post_id
//       Post.findBy({_id: postId}, function(err, foundPost){
//         if(err){
//           res.json({failure: 'Could not find specified post'})
//         }else{
//           var comments = foundPost.comments;
//
//           res.json({
//             success: true,
//             response: comments
//           })
//         }
//       })
//     }
//   })
// })
//
// router.post('posts/comments/:post_id', function(req,res){
//   var token = req.query.token;
//   var postId = req.params.post_id;
//
//   Token.findOne({token:token}, function(err){
//     if(err){
//       res.json({failure: "Failed to authenticate"})
//     }else{
//       User.findBy({_id: token.userId}, function(err, foundUser){
//         if(err){
//           res.json({failure: "Could not find user"})
//         }else{
//           // We will need the userId and userName for the poster component of the new comment
//           var userId= foundUser.id;
//           var userName = foundUser.fname + " "+ foundUser.lname;
//
//           Post.findBy({_id: postId}, function(err, foundPost){
//             if(err){
//               res.json({failure: "Failed to find specified post"})
//             }else{
//               // Once we have the post, we want to access the comments
//               var comments = foundPost.comments;
//               // Then create a comment to then add on to the existing Array
//               var newComment = {
//                 createdAt:new Date(),
//                 content: req.body.content,
//                 poster: {
//                   // need the name of the user
//                   name: userName,
//                   id: userId
//                 }
//               }
//               newComment.save(function(err, savedComment){
//                 if(err){
//                   res.json({failure: "Could not save comment"})
//                 }else{
//                   comments.push(savedComment);
//                   res.json({
//                     success: true,
//                     response: comments
//                   })
//                 }
//               })
//             }
//           })
//         }
//       })
//     }
//   })
// })
// router.get('posts/likes/:post_id', function(req,res){
//   var token = req.query.token;
//   var postId = req.params.post_id;
//   var hasLiked = false;
//   Token.findOne({token:token}, function(err){
//     if(err){
//       res.json({failure: "Could not authenticate"})
//     }else{
//       User.findBy({_id: token.userId}, function(err, foundUser){
//         if(err){
//           res.json({failure: "Could not find given user"})
//         }else{
//           var userId = foundUser.id;
//           var userName = foundUser.fname+ " "+ foundUser.lname;
//
//           Post.findBy({_id: postId}, function(err, foundPost){
//             if(err){
//               res.json({failure: 'Could not find given post'})
//             }else{
//               var likes = foundPost.likes;
//               var likeIndex = 0;
//               // check if this post has already been liked
//               // if yes, we will need to toggle it and remove it from the likes array
//               likes.forEach(function(like, index){
//                 if(like.id === userId){
//                   hasLiked = true;
//                   likeIndex = index;
//                 }
//               })
//               if(!hasLiked){
//                 hasLiked = true;
//                 var newLike = {
//                   name: userName,
//                   id: userId
//                 }
//                 likes.push(newLike);
//               }else{
//                 likes.splice(likeIndex, 1);
//               }
//               // we need to save the updated post object, and send it as a response to the get request
//               foundPost.save(function(err, savedPost) {
//                 if(err){
//                   res.json({failure: "Could not save the updated post"})
//                 }else{
//                   res.json({
//                     success: true,
//                     response: foundPost
//                   })
//                 }
//               })
//             }
//           })
//         }
//       })
//     }
//   })
// })
//



module.exports = router;
