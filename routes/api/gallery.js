const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

// Profile model
const Profile = require('../../models/Profile');

// Gallery model
const Gallery = require('../../models/Gallery');

// Photo model
const Photo = require('../../models/Photo');

// @route   GET api/gallery/:id
// @desc    Get single gallery
// @access  Public
router.get('/:id', (req, res)=>{
  Gallery.findById(req.params.id)
    .then(images=> res.json({images, result: 'ok'}))
    .catch(err => res.status(404).json({nopostfiund: 'No post found with that id'}));
});

// @route   POST api/gallery
// @desc    Create gallery
// @access  Private
router.post('/addPhoto', passport.authenticate('jwt', { session: false }), (req, res) => {
  Gallery.findOne({ title: req.body.gallery })
    .then(data => {
      if(req.body.images.length>0){
        req.body.images.map(d=>{
          let time = Date.now()
          setTimeout(()=>{
            fs.writeFile(__dirname + `/../../uploads/${time}-${d.name}`, d.thumbUrl.replace(/^data:image\/jpeg;base64,/, ""), {encoding: 'base64'}, function(err) {
              if(err){
                  console.log(err);
                }
            })
          }, 500);
          
          data.images.push(`${time}-${d.name}`)

        })
      }

      data.save().then(() => res.json({ 
        success: true,
        status: 'ok' 
      }))
    })
    .catch(err => {
      res.json({ err: 'Gallery not found' })
    })
  return
});

// @route   POST api/gallery
// @desc    Create gallery
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const newGallery = new Gallery({
    title: req.body.title,
    description: req.body.description,
    user: req.user.id,
    author: req.user.name
  });

  newGallery.save().then(
    res.send({
      success: true,
      status: 'ok'
    })
  );
  return
});

// @route   GET api/gallery
// @desc    Get all gallery
// @access  Public
router.get('/', (req, res) => {
  Gallery.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(errs => res.status(404).json({ nopostfiund: 'No Gallery' }));
});

// @route   DELETE api/gallery/:gallery_id
// @desc    delete gallery
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Gallery.findById(req.params.id)
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

// @route   PUT api/memo/:memo_id
// @desc    update memo
// @access  Private
// router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//   const { errors, isValid } = validateMemoInput(req.body);

//   // Check Validation
//   if (!isValid) {
//     // Return any errors with 400 status
//     return res.status(400).json(errors);
//   }

//   Profile.findOne({ user: req.user.id })
//     .then(profile => {
//       Memo.findById(req.params.id)
//         .then(post => {
//           // Check for post owener
//           if (post.user.toString() !== req.user.id) {
//             return res.status(401).json({ notauthorized: 'User not authorized' });
//           }

//           // Update post
//           Memo.findByIdAndUpdate(
//             // the id of the item to find
//             req.params.id,

//             // the change to be made. Mongoose will smartly combine your existing 
//             // document with this change, which allows for partial updates too
//             req.body,

//             // an option that asks mongoose to return the updated version 
//             // of the document instead of the pre-updated one.
//             { new: true },

//             // the callback function
//             (err, post) => {
//               // Handle any possible database errors
//               if (err) return res.status(500).send(err);
//               return res.send(post);
//             }
//           )

//         })
//         .catch(err => res.status(404).json({ updatepost: err }));
//     })
// });

module.exports = router;