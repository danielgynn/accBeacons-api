var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('lodash');

var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');

router.get('/login', function(req, res) {
  res.render('login', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    message: req.flash('loginMessage')
  })
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/signup', function(req, res) {
  res.render('signup', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    message: req.flash('loginMessage')
  })
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
