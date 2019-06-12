const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

// Notice model
const Notice = require('../../models/Notice');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validateNoticeInput = require('../../validation/notice');

// @route   POST api/notices
// @desc    Create notices
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{

  const {errors, isValid } = validateNoticeInput(req.body);

  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const newNotice = new Notice({
    title: req.body.title,
    content: req.body.content,
    public: req.body.public,
    user: req.user.id,
    author: req.user.name,
    images: req.body.images,
    // files: req.body.files,
  });

  // if(req.body.files.fileList.length>0){
  //   req.body.files.fileList.map(d=>{
  //     let time = Date.now()
  //     setTimeout(()=>{
  //       fs.writeFileSync(__dirname + `/../../uploads/${time}-${d.name}`, d.response, 'binary', function(err) {
  //         if(err){
  //             console.log(err);
  //           }
  //       })
  //     }, 500);
  //   })
  // }

  newNotice.save().then(
    res.send({
      success: true,
      status: 'ok'
    })
  );
  return
});

// @route   GET api/notices
// @desc    Get all notices
// @access  Public
router.get('/', (req, res)=>{
  Notice.find()
    .sort({date: -1})
    .then(posts=> res.json(posts))
    .catch(errs => res.status(404).json({nopostfiund: 'No posts'}));
});

// @route   GET api/notices/:id
// @desc    Get single notice
// @access  Public
router.get('/:id', (req, res)=>{
  Notice.findById(req.params.id)
    .then(post=> res.json({post, result: 'ok'}))
    .catch(err => res.status(404).json({nopostfiund: 'No post found with that id'}));
});

// @route   PUT api/notices/:post_id
// @desc    update post
// @access  Private
router.put('/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid } = validateNoticeInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Notice.findById(req.params.id)
        .then(post=>{
          // Check for post owener
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Update post
          Notice.findByIdAndUpdate(
            // the id of the item to find
            req.params.id,

            // the change to be made. Mongoose will smartly combine your existing
            // document with this change, which allows for partial updates too
            req.body,

            // an option that asks mongoose to return the updated version
            // of the document instead of the pre-updated one.
            {new: true},

            // the callback function
            (err, post) => {
            // Handle any possible database errors
                if (err) return res.status(500).send(err);
                return res.send(post);
            }
          )

        })
        .catch(err => res.status(404).json({updatepost: err}));
    })
});



// @route   DELETE api/notices/:post_id
// @desc    delete post
// @access  Private
router.delete('/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Notice.findById(req.params.id)
        .then(post=>{
          // Check for post owener
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Delete post
          post.remove().then(()=>res.json({success: true}));
        })
        .catch(err => res.status(404).json({deletepost: err}));
    })
});

// @route   POST api/notices/like/:id
// @desc    like post
// @access  Private
router.post('/like/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Notice.findById(req.params.id)
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

// @route   POST api/notices/like/:id
// @desc    unlike post
// @access  Private
router.post('/unlike/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Notice.findById(req.params.id)
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
  const {errors, isValid } = validateNoticeInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Notice.findById(req.params.id)
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
    Notice.findById(req.params.id)
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
