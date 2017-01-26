//  GET index.
var express = require('express');
var passport = require('passport');
var Location = require('../models/location');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api', function(req, res, next) {
  res.json({ message: 'hooray! welcome to our api!' });
});
// router.get("/api", Front.docsRequest.bind(Front));

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
       if (err)
       res.send(err);

       res.json({ message: 'Location created!' });
     });
   })

   // GET all Location objects
   .get(function(req, res) {
      Location.find(function(err, locations) {
          if (err)
              res.send(err);

          res.json(locations);
      });
    });

router.route('/api/locations/:location_id')
  // get the Location with that id
  // (accessed at GET http://localhost:3000/api/locations/:location_id)
  .get(function(req, res) {
    Location.findById(req.params.location_id, function(err, location) {
      if (err)
        res.send(err);
      res.json(location);
    });
  })

  // PUT - update a Location object
  .put(function(req, res) {
    Location.findById(req.params.location_id, function(err, location) {
      if (err)
        res.send(err);

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

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
