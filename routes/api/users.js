const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const ActiveDirectory = require('activedirectory');
const _ = require('lodash');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User')

// @route   GET api/users/test
// @desc    Test post route
// @access  Public

const config = { url: 'ldap://192.168.1.235:389',
                baseDN: 'DC=mainland,DC=com,DC=hk',
                username: 'administrator@mainland.com.hk',
                password: 'Xx#0&2io' }

router.post('/ladpSync', (req, res) => {
  const ad = new ActiveDirectory(config)
  console.log(`ad====`,ad);

  var query = 'OU=mainlandHK';

  var opts = {
    baseDN: 'DC=mainland,DC=com,DC=hk',
    filter: 'company=Mainland Headwear Holdings Limited'
  };

  ad.find(opts, function(err, results) {
    if ((err) || (!results)) {
      console.log(`HERE=====`, results);
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
   
    console.log('Users');
    _.each(results.users, function(user) {
    let ldapUser = {
      ...user,
      role: (user.dn.indexOf('OU=Admin')!== -1) ? 'Admin' : 'User'
    }

    User.findOne({ email: ldapUser.mail})
    .then(user => {
      if(user){
        return res.status(400).json({email: 'email already exists'});
      } else {
        // const avator = gravatar.url(ldapUser.email, {
        //   s: '200', // Size
        //   r: 'pg', // Rating
        //   d: 'mm' // Default
        // });
        const newUser = new User({
          name: ldapUser.cn,
          email: ldapUser.mail,
          // avator,
          password: 'passw0rd',
          role: ldapUser.role
        });

        bcrypt.genSalt(10, (err, salt)=> {
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    })
   
  });

  res.json({msg: "GoGo"})
});

// @route   GET api/users/register
// @desc    Register user
// @access  Public

router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email})
    .then(user => {
      if(user){
        return res.status(400).json({email: 'email already exists'});
      } else {
        const avator = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avator,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt)=> {
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

// @route   POST api/users/Login
// @desc    Login and return JWT token
// @access  Public
router.post('/login',(req, res)=>{
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const { userName, password, email, type} = req.body

  console.log(`req body====`, req.body);

  //Find user by email
  User.findOne({email})
    .then(user=>{
      // Check for user
      if(!user){
        errors.email = 'user email not found'
        //return res.status(404).json({ errors});
        return res.send({
          status: 'error',
          type,
          errors,
          currentAuthority: 'guest',
        });
      }
      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            // User Matched
            // Create JWT payload
            const payload = {
              id: user.id, 
              name: user.name,
              email: user.email,
              role: user.role,
              avator: user.avator
            }

            // Sign Token
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              { expiresIn: 3600000 }, 
              (err, token)=>{
                res.send({
                  success: true,
                  token: 'Bearer ' + token,
                  currentAuthority: user.role,
                  status: 'ok',
                  type
                })
                return;
              });
          } else {
            errors.password = 'Password not incorrect'
            return res.send({
              status: 'error',
              type,
              errors,
              currentAuthority: 'guest',
            });
          }
        })
    })
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res)=>{
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

module.exports = router;