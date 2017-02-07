//  GET index.
var express = require('express');
var passport = require('passport');
var jwt    = require('jsonwebtoken');
var mongoose = require('mongoose');
var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');
var jwtToken = ('jwtTokenSecret', 'YOUR_SECRET_STRING');

// ROUTE - index
router.get('/', function(req, res, next) {
  res.render('index', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  });
});

// GET API DOCS TODO
// router.get("/api", Front.docsRequest.bind(Front));

// ROUTE - API namespaced gateway
router.get('/api', function(req, res, next) {
  res.json({ message: 'Welcome to the Accessible Beacons API!' });
});

router.get('/login', function(req, res) {
  res.render('login', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    message: req.flash('loginMessage')
  })
});

router.get('/signup', function(req, res) {
  res.render('signup', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    message: req.flash('loginMessage')
  })
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile',  {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  })
});

router.get('/settings', isLoggedIn, function(req, res) {
  res.render('settings', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    user: req.user
  })
});

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

 router.delete('/locations/:location_id', function(req, res) {
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

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



// API METHODS

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

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

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
