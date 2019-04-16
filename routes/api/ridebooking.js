const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

// Location model
const Location = require('../../models/Location');

// Ridebooking model
const Ridebooking = require('../../models/Ridebooking');

// Destination model
const Destination = require('../../models/Destination');

// Profile model
const Profile = require('../../models/Profile');

// @route   POST api/ridebooking/destination
// @desc    Create Destination
// @access  Private
router.post('/location', passport.authenticate('jwt', { session: false }), (req, res) => {

  let newLocation = new Location({
    user: req.user.id,
    name: req.body.name,
    remark: req.body.remark,
  });

  newLocation.save()
    .then(
      res.send({
        success: true,
        status: 'ok'
      })
    );
  return;
});

// @route   POST api/ridebooking/destination
// @desc    Create Destination
// @access  Private
router.post('/destination', passport.authenticate('jwt', { session: false }), (req, res) => {

  let newDestination = new Destination({
    user: req.user.id,
    name: req.body.name,
    remark: req.body.remark,
  });

  newDestination.save()
    .then(
      res.send({
        success: true,
        status: 'ok'
      })
    );
  return;
});

// @route   POST api/ridebooking
// @desc    Create Ride Booking
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  let getGuest = null;
  if(typeof req.body.guest !== 'undefined'){
    getGuest = req.body.guest.split(',');
  }

  const rowLen = req.body.passenger.length;

  req.body.passenger.map((data,index)=>{
    let newRidebooking = new Ridebooking({
      passenger: req.body.passenger[index].toString(),
      pickupLocation: req.body.pickupLocation,
      targetLocation: req.body.targetLocation,
      date: req.body.date,
      return: req.body.return,
      numberOfGuest: req.body.numberOfGuest,
      guest: getGuest,
      remark: req.body.remark,
      user: req.user.id,
      author: req.user.name,
    });

    newRidebooking.save();

    if (rowLen === index + 1) {
      // last one
      res.send({
        success: true,
        status: 'ok'
      })
    } 
  })
  return
});

// @route   GET api/location
// @desc    Get all location
// @access  Public
router.get('/location', (req, res) => {
  Location.find()
    .sort({ createdat: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No location' }));
});


// @route   GET api/destination
// @desc    Get all destination
// @access  Public
router.get('/destination', (req, res) => {
  Destination.find()
    .sort({ createdat: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No destination' }));
});

// @route   GET api/ridebooking
// @desc    Get all ridebooking
// @access  Public
router.get('/', (req, res) => {
  Ridebooking.find()
    .sort({ createdat: -1 })
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