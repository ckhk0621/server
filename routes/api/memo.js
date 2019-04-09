const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

// Notice model
const Memo = require('../../models/Memo');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validateMemoInput = require('../../validation/memo');

// @route   POST api/memo
// @desc    Create memo
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateMemoInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newMemo = new Memo({
    title: req.body.title,
    content: req.body.content,
    public: req.body.public,
    user: req.user.id,
    author: req.user.name,
    priority: req.body.priority,
    images: req.body.images,
  });

  newMemo.save().then(
    res.send({
      success: true,
      status: 'ok'
    })
  );
  return
});

// @route   GET api/memo
// @desc    Get all memo
// @access  Public
router.get('/', (req, res) => {
  Memo.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No memo' }));
});

// @route   PUT api/memo/:memo_id
// @desc    update memo
// @access  Private
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateMemoInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Memo.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Update post
          Memo.findByIdAndUpdate(
            // the id of the item to find
            req.params.id,

            // the change to be made. Mongoose will smartly combine your existing 
            // document with this change, which allows for partial updates too
            req.body,

            // an option that asks mongoose to return the updated version 
            // of the document instead of the pre-updated one.
            { new: true },

            // the callback function
            (err, post) => {
              // Handle any possible database errors
              if (err) return res.status(500).send(err);
              return res.send(post);
            }
          )

        })
        .catch(err => res.status(404).json({ updatepost: err }));
    })
});

// @route   DELETE api/memo/:memo_id
// @desc    delete memo
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Memo.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Delete post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ deletepost: err }));
    })
});

module.exports = router;