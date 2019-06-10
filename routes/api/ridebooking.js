const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');

// Driver model
const Driver = require('../../models/Driver');

// Plate model
const Plate = require('../../models/Plate');

// Location model
const Location = require('../../models/Location');

// Ridebooking model
const Ridebooking = require('../../models/Ridebooking');

// Destination model
const Destination = require('../../models/Destination');

// Profile model
const Profile = require('../../models/Profile');

// @route   POST api/ridebooking/driver
// @desc    Create Driver
// @access  Private
router.post('/driver', passport.authenticate('jwt', { session: false }), (req, res) => {

  let newDriver = new Driver({
    user: req.user.id,
    name: req.body.name
  });

  newDriver.save()
    .then(
      res.send({
        success: true,
        status: 'ok'
      })
    );
  return;
});

// @route   GET api/driver
// @desc    Get all driver
// @access  Public
router.get('/driver', (req, res) => {
  Driver.find()
    .sort({ createdat: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No Driver' }));
});

// @route   DELETE api/ridebooking/:driver_id
// @desc    delete driver
// @access  Private
router.delete('/driver/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Driver.findById(req.params.id)
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

// @route   POST api/ridebooking/plate
// @desc    Create Plate
// @access  Private
router.post('/plate', passport.authenticate('jwt', { session: false }), (req, res) => {

  let newPlate = new Plate({
    user: req.user.id,
    name: req.body.name
  });

  newPlate.save()
    .then(
      res.send({
        success: true,
        status: 'ok'
      })
    );
  return;
});

// @route   GET api/plate
// @desc    Get all plate
// @access  Public
router.get('/plate', (req, res) => {
  Plate.find()
    .sort({ createdat: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No Plate' }));
});

// @route   DELETE api/ridebooking/:plate_id
// @desc    delete plate
// @access  Private
router.delete('/plate/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Plate.findById(req.params.id)
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

// @route   POST api/ridebooking/location
// @desc    Create Location
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

  // req.body.passenger.map((data,index)=>{
  //   let newRidebooking = new Ridebooking({
  //     orderBy: req.body.orderBy,
  //     passenger: req.body.passenger[index].toString(),
  //     pickupLocation: req.body.pickupLocation,
  //     targetLocation: req.body.targetLocation,
  //     date: req.body.date,
  //     return: req.body.return,
  //     numberOfGuest: req.body.numberOfGuest,
  //     guest: getGuest,
  //     remark: req.body.remark,
  //     user: req.user.id,
  //     author: req.user.name,
  //   });

  //   if (rowLen === index + 1) {
  //     // last one
  //     newRidebooking.save()
  //     .then(
  //       res.send({
  //         success: true,
  //         status: 'ok'
  //       })
  //     )
  //   }
  // })

  let offset = (new Date().getTimezoneOffset() / 60) * -1;
  let time = moment(req.body.date).utcOffset(8).format('YYYY-MM-DD');
  let newRidebooking = new Ridebooking({
    orderBy: req.body.orderBy,
    passenger: req.body.passenger,
    pickupLocation: req.body.pickupLocation,
    targetLocation: req.body.otherDestination ? req.body.otherDestination : req.body.targetLocation,
    date: time,
    return: req.body.return,
    numberOfGuest: req.body.numberOfGuest,
    guest: getGuest,
    remark: req.body.remark,
    user: req.user.id,
    author: req.user.name,
    plate: req.body.plate,

    // children: {
    //   passenger: req.body.passenger,
    //   pickupLocation: req.body.pickupLocation,
    //   targetLocation: req.body.targetLocation,
    //   date: req.body.date,
    //   return: req.body.return,
    //   numberOfGuest: req.body.numberOfGuest,
    //   guest: getGuest,
    //   remark: req.body.remark,
    //   user: req.user.id,
    //   author: req.user.name,
    // }
  });

    newRidebooking.save()
    .then(
      res.send({
        success: true,
        status: 'ok'
      })
    )

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
    .sort({ date: 'asc' })
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
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
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
router.put('/:id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      Ridebooking.findById(req.params.id)
        .then(post=>{
          // Check for post owener
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
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

// @route   DELETE api/ridebooking/:location_id
// @desc    delete location
// @access  Private
router.delete('/location/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Location.findById(req.params.id)
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

// @route   DELETE api/destination/:destination_id
// @desc    delete destination
// @access  Private
router.delete('/destination/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Destination.findById(req.params.id)
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

// @route   PUT api/destination/:location_id
// @desc    update location
// @access  Private
router.put('/location/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Location.findById(req.params.id)
        .then(post => {
          // Check for post owener
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
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
          if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
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
