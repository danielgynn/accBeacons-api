var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('lodash');

var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile',  {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  })
});

router.get('/settings/:user_id', isLoggedIn, function(req, res) {
  res.render('settings', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  })
});

router.post('/settings/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err);
    }

    // Update user data
    user.email = req.param('email');
    user.name = req.param('name');
    user.phoneNumber = req.param('phoneNumber');

    // save the location
    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/profile');
      }
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
