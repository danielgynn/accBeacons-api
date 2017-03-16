var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('lodash');
var http = require('http');
var querystring = require('querystring');

var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');

router.get('/locations', isLoggedIn, function(req, res) {
  Location.find(function(err, locations) {
    var length = locations.length;
    if (err) {
      res.send(err);
    } else {
      res.render('locations',  {
        layout: './partials/layout',
        title: 'Accessible Beacons',
        user: req.user,
        locations: locations,
        locationsTotal: length,
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
        pbxNumber: '01227806309',
        location: location,
        message: req.flash('editMessage')
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
    location.mapURL = req.param('mapURL');
    location.phoneNumber = req.param('phoneNumber');
    location.text = req.param('text');

    // save the location
    location.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        req.flash('editMessage', 'Your changes have been saved successfully.');
        res.redirect('/locations/' + req.params.location_id);
      }
    });
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

router.get('/savedLocations', isLoggedIn, function(req, res) {
  res.render('savedLocations',  {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  });
});

router.post('/favourite/:location_id/:user_id', function(req, res) {
  Location.findById(req.params.location_id, function(err, location) {
    User.findByIdAndUpdate(req.params.user_id, {
      $push: {
        'favourites': {
          location: location,
          data: location
        }
      }
    }, function(err, store) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/savedLocations');
      }
    });
  });
});

router.get('/call/:location_id/:phoneNumber', function(req, res) {
  const data = querystring.stringify({
    phoneNumber: req.params.phoneNumber,
    extNumber: req.params.location_id
  });

  var options = {
    host: 'danielknox.ddns.net',
    port: '8080',
    path: '/call?phonenumber=' + req.params.phoneNumber + '&extensionID=' + req.params.location_id,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  callback = function(res) {
    res.on('data', function(chunk) {
      console.log(chunk);
    });
    res.on('end', function() {
      console.log('end');
    })
  }

  http.request(options, callback).end();
  res.redirect('/locations/' + req.params.location_id);

  // Redirect
  // if (err) {
  //   res.redirect('/locations/' + req.params.location_id);
  //   console.log(err);
  //   req.flash('editMessage', 'The call has failed.');
  // } else {
  //   res.redirect('/locations/' + req.params.location_id);
  //   console.log(data);
  //   req.flash('editMessage', 'The call has been sent.');
  // }
});

 module.exports = router;

 function isLoggedIn(req, res, next) {
   if (req.isAuthenticated())
       return next();
   res.redirect('/');
 }
