const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');

// Roombooking model
const Room2booking = require('../../models/Room2booking');

// Profile model
const Profile = require('../../models/Profile');

// @route   POST api/roombooking
// @desc    Create Ride Booking
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let time = moment(req.body.date).utcOffset(8).format('YYYY-MM-DD')
  let newRoom2booking = new Room2booking({
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

  newRoom2booking.save()
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
  Room2booking.find()
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
      Room2booking.findById(req.params.id)
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