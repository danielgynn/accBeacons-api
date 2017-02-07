var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('lodash');

var Location = require('../models/location');
var User = require('../models/user');
var router = express.Router();
var configDB = require('../config/database.js');

// GET API DOCS TODO
// router.get("/api", Front.docsRequest.bind(Front));

// ROUTE - index
router.get('/', function(req, res, next) {
  res.render('index', {
    layout: './partials/layout',
    title: 'Accessible Beacons',
    appDescription: 'The application designed to provide detailed and useful information, based on locations and adhering to accessibility requrements.',
    user: req.user
  });
});

// ROUTE - API namespaced gateway
router.get('/api', function(req, res, next) {
  res.json({ message: 'Welcome to the Accessible Beacons API! The documentation is not currently ready, but is coming.' });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
