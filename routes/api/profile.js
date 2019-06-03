const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validatorEducationInput = require('../../validation/education');
const validatorExperienceInput = require('../../validation/experience');
const validatorProfileInput = require('../../validation/profile');

// Load model
const Profile = require('../../models/Profile');
const User = require('../../models/User');


router.get('/test', (req, res) => res.json({msg: "Profile work"}));


// @route   GET api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public

router.get('/user/:user_id', (req, res)=>{
  const errors = {};
  Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avator'])
    .then(profile=>{
      if(!profile){
        errors.noprofile = 'The user profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    get all profiles
// @access  Public

// router.get('/all', (req, res)=>{
//   const errors = {};
//   Profile.find()
//     .populate('user', ['name'])
//     .then(profiles=>{
//       if(!profiles){
//         errors.noprofile = 'There are no profiles';
//         return res.status(404).json(errors);
//       }
//       console.log(`profiles====`,profiles);
//       res.json(profiles);
//     })
//     .catch(err=> res.status(404).json({profiles: 'There are no profiles'}));
// });

router.get('/all', (req, res) => {
    User.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(errs => res.status(404).json({ nopostfiund: 'No Users' }));
});


// @route   GET api/profile/handle/:handle
// @desc    get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res)=>{
  const errors = {};
  Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avator'])
    .then(profile=>{
      if(!profile){
        errors.noprofile = 'The user profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
});


// @route   GET api/profile/current
// @desc    get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const errors = {};

  Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avator'])
    .then(profile=>{
      if(!profile){
        errors.noprofile = 'The user profile not found';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
});

// @route   POST api/profile/experience
// @desc    add experience to profile
// @access  Public

router.post('/experience',passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validatorExperienceInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile=>{
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        descrpition: req.body.descrpition
      }

      // Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    })
    .catch(err=> res.status(404).json(err));
});

// @route   POST api/profile/education
// @desc    add education to profile
// @access  Public

router.post('/education',passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validatorEducationInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile=>{
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        descrpition: req.body.descrpition
      }

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    })
    .catch(err=> res.status(404).json(err));
});


// @route   DELETE api/profile/experience/:exp_id
// @desc    delete education from profile
// @access  Private

router.delete('/experience/:exp_id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      profile.save().then(profile=>res.json(profile));
    })
    .catch(err=> res.status(404).json(err));
});

// @route   DELETE api/profile/education/:edu_id
// @desc    delete education from profile
// @access  Private

router.delete('/education/:edu_id',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile=>{
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);

      profile.save().then(profile=>res.json(profile));
    })
    .catch(err=> res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    delete education from profile
// @access  Private

router.delete('/',passport.authenticate('jwt', {session: false}), (req, res)=>{
  console.log(req.user.id)
  Profile.findOneAndRemove({user: req.user.id})
    .then(()=>{
      User.findOneAndRemove({_id: req.user.id})
        .then(()=> res.json({ success: true}))
    })
    .catch(err=> res.status(404).json(err));
});

// @route   POST api/profile
// @desc    create user profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validatorProfileInput(req.body);

  // Check Validation
  if(!isValid){
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  
  if(typeof req.body.skills !== 'undefined'){
    profileFields.skills = req.body.skills.split(',');
  }

  profileFields.social = {};
  if(req.body.youtube) profileFields.social = req.body.youtube;
  if(req.body.twitter) profileFields.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.linkedin = req.body.linkedin;
  if(req.body.instagram) profileFields.instagram = req.body.instagram;


  Profile.findOne({ user: req.user.id})
    .then(profile=>{
      if(profile){
        Profile.findOneAndUpdate(
          {user: req.user.id}, 
          {$set: profileFields},
          {new: true}
        )
        .then(profile=>res.json(profile));
      } else{
        // Create

        // Check if handle exists
        Profile.findOne({handle: profileFields.handle}).then(profile=>{
          if(profile){
            errors.handle = 'The handle already exists';
            res.status(400).json(errors);
          }

          // Save pforile
          new Profile(profileFields).save().then(profile=>res.json(profile));
        })

      }
    })

});


module.exports = router;