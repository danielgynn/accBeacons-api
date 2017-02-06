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

router.get('/locations', isLoggedIn, function(req, res) {
  Location.find(function(err, locations) {
    if (err) {
      res.send(err);
    } else {
      res.render('locations',  {
        layout: './partials/layout',
        title: 'Accessible Beacons',
        user: req.user,
        locations: locations
      })
    }
  });
});

router.get('/api/locations', function(req, res) {
  Location.find(function(err, locations) {
    if (err) {
      res.send(err);
    } else {
      res.json(locations);
    }
  });
});

// GET all Location objects
//    .get(function(req, res) {
//       Location.find(function(err, locations) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.json(locations);
//         }
//       });
//     });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

router.get('/profile/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });
})

router.put('/profile/:user_id', function(req, res) {
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
//   .put(function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//       if (err) {
//         res.send(err);
//       }
//
//       // Update user data
//       user.email = req.param('email');
//       user.name = req.param('name');
//       user.phoneNumber = req.param('phoneNumber');
//       user.admin = req.param('admin');
//
//       // save the location
//       user.save(function(err) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.json({ message: 'User details updated!' });
//         }
//       });
//      });
//   })

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

// GET API DOCS TODO
// router.get("/api", Front.docsRequest.bind(Front));

// ROUTE - API namespaced gateway
router.get('/api', function(req, res, next) {
  res.json({ message: 'Welcome to the Accessible Beacons API!' });
});

// router.route('/api/signup/')
//   // POST a new User object
//   .post(function(req, res) {
//     // create a new instance of the Location model
//     var user = new User({
//       name: req.param('name'),
//       email: req.param('email'),
//       password: req.param('password'),
//       admin: false
//     });
//
//     // save the location and check for errors
//     user.save(function(err) {
//       if (err) throw err;
//
//       console.log('User saved successfully');
//       res.json({ success: true });
//      });
//    })
//
// // ROUTE - All Users
// router.route('/api/users')
//   .get(function(req, res) {
//      User.find(function(err, users) {
//        if (err) {
//          res.send(err);
//        } else {
//          res.json(users);
//        }
//      });
//    });
//
// router.route('/api/users/:user_id')
//   .get(function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(user);
//       }
//     });
//   })
//
//   .put(function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//       if (err) {
//         res.send(err);
//       }
//
//       // Update user data
//       user.email = req.param('email');
//       user.name = req.param('name');
//       user.phoneNumber = req.param('phoneNumber');
//       user.admin = req.param('admin');
//
//       // save the location
//       user.save(function(err) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.json({ message: 'User details updated!' });
//         }
//       });
//      });
//   })
//
//   .delete(function(req, res) {
//     User.remove({
//       _id: req.params.user_id
//     }, function(err, user) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json({ message: 'The user ' + req.params.user_id + ' has been successfully deleted' });
//       }
//     });
//   });
//

//
// // ROUTE - All locations
// router.route('/api/locations/')
//   // POST a new Location object
//   .post(function(req, res) {
//     // create a new instance of the Location model
//     var location = new Location();
//
//     // set the data from the request
//     location.name = req.param('name');
//     location.text = req.param('text');
//
//     // save the location and check for errors
//     location.save(function(err) {
//        if (err) {
//          res.send(err);
//        } else {
//          res.json({ message: 'Location created!' });
//        }
//      });
//    })
//
//    // GET all Location objects
//    .get(function(req, res) {
//       Location.find(function(err, locations) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.json(locations);
//         }
//       });
//     });
//
// // ROUTE - specific location
// router.route('/api/locations/:location_id')
//   // get the Location with that id
//   // (accessed at GET http://localhost:3000/api/locations/:location_id)
//   .get(function(req, res) {
//     Location.findById(req.params.location_id, function(err, location) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(location);
//       }
//     });
//   })
//
//   // PUT - update a Location object
//   .put(function(req, res) {
//     Location.findById(req.params.location_id, function(err, location) {
//       if (err) {
//         res.send(err);
//       }
//
//       location.name = req.param('name');
//       location.text = req.param('text');
//
//       // save the location
//       location.save(function(err) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.json({ message: 'Location updated!' });
//         }
//       });
//      });
//    })
//
//   // DELETE - delete a Location object
//   .delete(function(req, res) {
//     Location.remove({
//       _id: req.params.location_id
//     }, function(err, location) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json({ message: 'The location ' + req.params.location_id + ' has been successfully deleted' });
//       }
//     });
//   });

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
