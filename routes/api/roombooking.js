const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');

// Roombooking model
const Roombooking = require('../../models/Roombooking');

// Location model
const Location = require('../../models/Location');

// Ridebooking model
const Ridebooking = require('../../models/Ridebooking');

// Destination model
const Destination = require('../../models/Destination');

// Profile model
const Profile = require('../../models/Profile');

// @route   POST api/ridebooking
// @desc    Create Ride Booking
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {


  // let offset = (new Date().getTimezoneOffset() / 60) * -1;
  let time = moment(req.body.date).utcOffset(8).format('YYYY-MM-DD')
  let startTime = moment(req.body.startTime).utcOffset(8).format('HH:MM')
  let endTime = moment(req.body.endTime).utcOffset(8).format('HH:MM')
  let newRoombooking = new Roombooking({
    orderBy: req.body.orderBy,
    reservation: req.body.reservation,
    startTime: startTime,
    endTime: endTime,
    date: time,
    type: req.body.type,
    content: req.body.content,
    remark: req.body.remark,
    user: req.user.id
  });

  newRoombooking.save()
    .then(
      res.send({
        success: true,
        status: 'ok'
      })
    )

  return
});

// @route   GET api/ridebooking
// @desc    Get all ridebooking
// @access  Public
router.get('/', (req, res) => {
  Ridebooking.find()
    .sort({ createdat: 'asc' })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No booking' }));
});

// @route   DELETE api/ridebooking/:ridebooking_id
// @desc    delete ridebooking
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Ridebooking.findById(req.params.id)
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

// @route   PUT api/ridebooking/:post_id
// @desc    update ridebooking
// @access  Private
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Ridebooking.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Update post
          Ridebooking.findByIdAndUpdate(
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

// @route   DELETE api/ridebooking/:location_id
// @desc    delete location
// @access  Private
router.delete('/location/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Location.findById(req.params.id)
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

// @route   DELETE api/destination/:destination_id
// @desc    delete destination
// @access  Private
router.delete('/destination/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Destination.findById(req.params.id)
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

// @route   PUT api/destination/:location_id
// @desc    update location
// @access  Private
router.put('/location/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Location.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Update post
          Location.findByIdAndUpdate(
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

// @route   PUT api/destination/:destination_id
// @desc    update destination
// @access  Private
router.put('/destination/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Destination.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Update post
          Destination.findByIdAndUpdate(
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

module.exports = router;