var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('lodash');

var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');

router.get('/locations', isLoggedIn, function(req, res) {
  Location.find(function(err, locations) {
    if (err) {
      res.send(err);
    } else {
      res.render('locations',  {
        layout: './partials/layout',
        title: 'Accessible Beacons',
        user: req.user,
        locations: locations,
        locationLink: 'locations/' + locations._id
      })
    }
  });
});

router.get('/locationAdd', isLoggedIn, function(req, res) {
  res.render('locationAdd',  {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  })
});

router.post('/locations', function(req, res) {
  // create a new instance of the Location model
  var location = new Location();

  // set the data from the request
  location.name = req.param('name');
  location.text = req.param('text');
  location.extNumber = Math.floor(Math.random()*999) + 100;

  // save the location and check for errors
  location.save(function(err) {
     if (err) {
       res.send(err);
     } else {
       res.redirect('/locations');
     }
   });
 });

// GET Location by ID
router.get('/locations/:location_id', isLoggedIn, function(req, res) {
  Location.findById(req.params.location_id, function(err, location) {
    if (err) {
      res.send(err);
    } else {
      res.render('location',  {
        layout: './partials/layout',
        title: 'Accessible Beacons',
        user: req.user,
        location: location
      })
    }
  });
});

router.get('/editLocation/:location_id', isLoggedIn, function(req, res) {
  Location.findById(req.params.location_id, function(err, location) {
    if (err) {
      res.send(err);
    } else {
      res.render('editLocation',  {
        layout: './partials/layout',
        title: 'Accessible Beacons',
        user: req.user,
        location: location
      })
    }
  });
});

router.post('/editLocation/:location_id', function(req, res) {
  Location.findById(req.params.location_id, function(err, location) {
    if (err) {
      res.send(err);
    }

    // Update user data
    location.name = req.param('name');
    location.text = req.param('text');

    // save the location
    location.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/locations');
      }
    });
  });
});

router.post('/deleteLocation/:location_id', function(req, res) {
  Location.remove({
    _id: req.params.location_id
  }, function(err, location) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/locations');
    }
  });
});

 module.exports = router;

 function isLoggedIn(req, res, next) {
   if (req.isAuthenticated())
       return next();
   res.redirect('/');
 }
