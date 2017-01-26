//  GET index.
var express = require('express');
var passport = require('passport');
var Location = require('../models/location');
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

router.route('/api/login')
  .post(passport.authenticate('local-login', {

  }))
  .get('/login', function(req, res, next) {
    // res.render('login.ejs', { message: req.flash('loginMessage') });
  });

router.route('/api/signup')
  .post(passport.authenticate('local-signup', {
    // successRedirect : '/profile', // redirect to the secure profile section
    // failureRedirect : '/signup', // redirect back to the signup page if there is an error
    // failureFlash : true // allow flash messages
  }))

  .get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('loginMessage') });
  });

router.get('/api/logout', function(req, res) {
  req.logout();
  res.redirect('/api');
});

// ROUTE - all locations
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
