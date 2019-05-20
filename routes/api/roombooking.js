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

// @route   POST api/roombooking
// @desc    Create Ride Booking
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let time = moment(req.body.date).utcOffset(8).format('YYYY-MM-DD')
  let newRoombooking = new Roombooking({
    orderBy: req.body.orderBy,
    reservation: req.body.reservation,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    date: time,
    bookingType: req.body.bookingType,
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

// @route   GET api/roombooking
// @desc    Get all roombooking
// @access  Public
router.get('/', (req, res) => {
  Roombooking.find()
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
      Roombooking.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Delete post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ deletepost: err }));
    })
});

module.exports = router;