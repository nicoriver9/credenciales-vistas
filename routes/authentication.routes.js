const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth.js');

router.post('/signin', (req, res, next) => {    
    req.check('username', 'Username is Required').notEmpty();
    req.check('password', 'Password is Required').notEmpty();
    const errors = req.validationErrors();
    if (errors.length > 0) {
      //req.flash('message', errors[0].msg);
      res.redirect('/signin');
    }
    passport.authenticate('local.signin', {
      successRedirect: '/credentials',
      failureRedirect: '/signin',
      //failureFlash: true
    })(req, res, next);
  });

  // router.get('/credentials', (req, res) => {
  //   res.render('credentials');
  // });

  router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
  });
  
  router.get('/credentials', isLoggedIn, (req, res) => {
    res.render('credentials');
  });


  module.exports = router