//  GET index.
var express = require('express');
var passport = require('passport');
var jwt    = require('jsonwebtoken');
var mongoose = require('mongoose');
var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');
// router.set('superSecret', configDB.secret);

// ROUTE - index
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET API DOCS TODO
// router.get("/api", Front.docsRequest.bind(Front));

// ROUTE - API namespaced gateway
router.get('/api', function(req, res, next) {
  res.json({ message: 'Welcome to the Accessible Beacons API!' });
});

// route middleware to verify a token
// router.use(function(req, res, next) {
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, router.get(configDB.secret), function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//   }
// });

router.route('/api/signup/')
  // POST a new User object
  .post(function(req, res) {
    // create a new instance of the Location model
    var user = new User({
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password'),
      admin: false
    });

    // save the location and check for errors
    user.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      res.json({ success: true });
     });
   })

router.route('/api/authenticate')
  .post(function(req, res) {
    // find the user
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, 'superSecret', {
            expiresIn : 60*60*24 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  })

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
