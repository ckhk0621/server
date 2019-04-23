const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

// Notice model
const Inout = require('../../models/Inout');

// Profile model
const Profile = require('../../models/Profile');

// @route   POST api/inout
// @desc    Create inout
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const newInout = new Inout({
    staff: req.body.staff,
    remark: req.body.remark,
    type: req.body.type,
    user: req.user.id,
    inout: req.body.inout,
    author: req.user.name,
    priority: req.body.priority
  });

  newInout.save().then(
    res.send({
      success: true,
      status: 'ok'
    })
  );
  return
});

// @route   GET api/inout
// @desc    Get all inout
// @access  Public
router.get('/', (req, res) => {
  Inout.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No memo' }));
});

// @route   DELETE api/inout/:inout_id
// @desc    delete inout
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Inout.findById(req.params.id)
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