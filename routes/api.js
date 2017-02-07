var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('lodash');

var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');

// TODO: These need to be tidied and, in some cases, deleted.

// API METHODS
router.get('/api/locations', function(req, res) {
  Location.find(function(err, locations) {
    if (err) {
      res.send(err);
    } else {
      res.json(locations);
    }
  });
});

router.get('/api/locations/:location_id', function(req, res) {
  Location.findById(req.params.location_id, function(err, location) {
    if (err) {
      res.send(err);
    } else {
      res.json(location);
    }
  });
});

// ROUTE - All locations
router.post('/api/locations/', function(req, res) {
  // create a new instance of the Location model
  var location = new Location();

  // set the data from the request
  location.name = req.param('name');
  location.text = req.param('text');

  // save the location and check for errors
  location.save(function(err) {
     if (err) {
       res.send(err);
     } else {
       res.json({ message: 'Location created!' });
     }
   });
 });

 // PUT - update a Location object
router.put('/api/locations/:location_id', function(req, res) {
  Location.findById(req.params.location_id, function(err, location) {
    if (err) {
      res.send(err);
    }

    location.name = req.param('name');
    location.text = req.param('text');

    // save the location
    location.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: 'Location updated!' });
      }
    });
  });
});

 // DELETE - delete a Location object
router.delete('/api/locations/:location_id', function(req, res) {
  Location.remove({
    _id: req.params.location_id
  }, function(err, location) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'The location ' + req.params.location_id + ' has been successfully deleted' });
    }
  });
});

router.get('/api/users/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });
});

// ROUTE - All Users
router.route('/api/users')
  .get(function(req, res) {
     User.find(function(err, users) {
       if (err) {
         res.send(err);
       } else {
         res.json(users);
       }
     });
   });

router.put('/api/users/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err);
    }

    // Update user data
    user.email = req.param('email');
    user.name = req.param('name');
    user.phoneNumber = req.param('phoneNumber');
    user.admin = req.param('admin');

    // save the location
    user.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: 'User details updated!' });
      }
    });
   });
})

 router.route('/api/users/:user_id')
   .delete(function(req, res) {
     User.remove({
       _id: req.params.user_id
     }, function(err, user) {
       if (err) {
         res.send(err);
       } else {
         res.json({ message: 'The user ' + req.params.user_id + ' has been successfully deleted' });
       }
     });
   });

 module.exports = router;

 function isLoggedIn(req, res, next) {
   if (req.isAuthenticated())
       return next();
   res.redirect('/');
 }
