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
    user: req.user,
    message: req.flash('settingsMessage')
  })
});

router.get('/settings/:user_id', isLoggedIn, function(req, res) {
  res.render('settings', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user,
    message: req.flash('settingsMessage')
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
        req.flash('settingsMessage', 'Your profile has been updated successfully.');
        res.redirect('/profile');
      }
    });
  });
});

router.post('/toggleTheme/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (user.darkTheme) {
      user.darkTheme = false;
    } else {
      user.darkTheme = true;
    }
    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        req.flash('settingsMessage', 'Your theme preferences have been saved successfully.');
        res.redirect('/settings/' + user.user_id);
      }
    });
  });
});

router.post('/toggleInverted/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (user.inverted) {
      user.inverted = false;
    } else {
      user.inverted = true;
    }
    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        req.flash('settingsMessage', 'Your preferences for colour inversion have been saved successfully.');
        res.redirect('/settings/' + user.user_id);
      }
    });
  });
});

router.post('/toggleLargeText/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (user.largeFont) {
      user.largeFont = false;
    } else {
      user.largeFont = true;
    }
    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        req.flash('settingsMessage', 'Your font size preferences have been saved successfully.');
        res.redirect('/settings/' + user.user_id);
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
