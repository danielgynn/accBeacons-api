//  GET index.
var express = require('express');
var passport = require('passport');
var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();

// ROUTE - index
router.get('/', function(req, res, next) {
  res.render('index');
});

// ROUTE - API namespaced gateway
router.get('/api', function(req, res, next) {
  res.json({ message: 'Welcome to the Accessible Beacons API!' });
});

// GET API DOCS TODO
// router.get("/api", Front.docsRequest.bind(Front));

router.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) return next(err);
    if (user) res.send({ access_token: user.token });
    else res.send(404, 'Incorrect username or password.');
  })(req, res, next);
});

router.post('/api/signup', function(req, res, next) {
  // Create new user
  var user = new User();
  user.local.email = req.param('email');
  user.local.password = req.param('password');

  user.save(function(err) {
     if (err) {
       res.send(err);
     } else {
       res.json({ message: 'User created!' });
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

router.route('/api/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json(user);
      }
    });
  })

  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }

      // Update user data
      user.local.email = req.param('email');
      user.local.password = req.param('password');

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

// ROUTE - Logout
router.route('/api/logout')
  .get(function(req, res) {
    req.logout();
    res.redirect('/api');
  });

// ROUTE - All locations
router.route('/api/locations/')
  // POST a new Location object
  .post(function(req, res) {
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
   })

   // GET all Location objects
   .get(function(req, res) {
      Location.find(function(err, locations) {
        if (err) {
          res.send(err);
        } else {
          res.json(locations);
        }
      });
    });

// ROUTE - specific location
router.route('/api/locations/:location_id')
  // get the Location with that id
  // (accessed at GET http://localhost:3000/api/locations/:location_id)
  .get(function(req, res) {
    Location.findById(req.params.location_id, function(err, location) {
      if (err) {
        res.send(err);
      } else {
        res.json(location);
      }
    });
  })

  // PUT - update a Location object
  .put(function(req, res) {
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
   })

  // DELETE - delete a Location object
  .delete(function(req, res) {
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

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
