const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avator: req.body.avator,
    user: req.user.id
  });

  newPost.save().then(post=>res.json(post));
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res)=>{
  Post.find()
    .sort({date: -1})
    .then(posts=> res.json(posts))
    .catch(errs => res.status(404).json({nopostfiund: 'No posts'}));
});

// @route   GET api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', (req, res)=>{
  Post.findById(req.params.id)
    .then(post=> res.json(post))
    .catch(err => res.status(404).json({nopostfiund: 'No post found with that id'}));
});


// @route   DELETE api/posts/:post_id
// @desc    delete post
// @access  Private
router.delete('/posts/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Post.findById(req.params.id)
        .then(post=>{
          // Check for post owener
          if(post.user.toString() !== req.user.id){
            return res.status(401).json({notauthorized: 'User not authorized'});
          }

          // Delete post
          post.remove().then(()=>res.json({success: true}));
        })
        .catch(err => res.status(404).json({deletepost: err}));
    })
});

// @route   POST api/posts/like/:id
// @desc    like post
// @access  Private
router.post('/like/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Post.findById(req.params.id)
        .then(post=>{
          if(
            post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({alreadylike: 'User already liked this post'});
          }

          // Add user id to likes array
          post.likes.unshift({user: req.user.id});

          post.save().then(post=>res.json(post));
        })
        .catch(err => res.status(404).json({likepost: err}));
    })
});

// @route   POST api/posts/like/:id
// @desc    unlike post
// @access  Private
router.post('/unlike/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Post.findById(req.params.id)
        .then(post=>{
          if(
            post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({notliked: 'You have not yet liked this post'});
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item=>item.user.toString())
            .indexOf(req.user.id)

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));

        })
        .catch(err => res.status(404).json({unlikepost: err}));
    })
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res)=>{
  const {errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post=>{
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avator: req.body.avator,
        user: req.user.id
      }

      // Add new comment
      post.comments.unshift(newComment);

      // Save
      post.save().then(post=>res.json(post));
    })
    .catch(err=>res.status(404).json({postnotfound: 'Not post found'}));
});


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', {session: false}),
  (req, res)=>{
    Post.findById(req.params.id)
      .then(post=>{
        // Check to see if the comment exists
        if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id).length===0){
          return res.status(404).json({commentnotexisits: 'Comment not exisits'});
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item=>item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post=>res.json(post));
      })
      .catch(err => res.status(404).json({deletepostcomment: err}));
  });

module.exports = router;