const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

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

// @route   POST api/addPhoto
// @desc    Create Photo
// @access  Private
router.post('/addPhoto', passport.authenticate('jwt', { session: false }), (req, res) => {
  Gallery.findOne({ title: req.body.gallery })
    .then(data => {
      if(req.body.images.length>0){
        req.body.images.map(d=>{
          let time = Date.now();
          setTimeout(()=>{
            const imageURL =  d.thumbUrl.replace(/^data:image\/png;base64,/, "");
            const binaryData  =   new Buffer(imageURL, 'base64').toString('binary');
            const reqPath = path.join(__dirname, '../../');
            fs.writeFile(reqPath + `/uploads/${time}-${d.name}`, binaryData, {encoding: 'binary'}, function(err) {
              if(err){
                  console.log(err);
                }
            })
          }, 500);

          console.log(`image data===`, d);
          
          data.images.push(`${time}-${d.name}`)

        })
      }

      console.log(`DATA=====`,data);

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
    year: moment(req.body.year).utcOffset(8).format('YYYY-MM'),
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
  const data = req.query;
  Gallery.find()
    .sort({ year: -1 })
    .then(posts => {
      posts.map(d=>console.log(`posts year==`, moment(d.year).format('YYYY-MM')));
      const resData = posts.filter(d=> {
        console.log(moment(data.time).format('YYYY')===moment(d.year).format('YYYY').toString());
        if( moment(d.year).format('YYYY-MM').toString() >= moment(data.time).format('YYYY-MM')){
          return d
        }
      });
      console.log(`resData===`, resData);
      return res.json(resData)
    })
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