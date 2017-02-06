var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hbs = require('express-hbs');
var session = require('express-session');
var flash = require('connect-flash');
var jwt    = require('jsonwebtoken');

var app = express();

// Start by loading up all our mongoose models and connecting.
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
app.set('superSecret', configDB.secret);

// Import routes.
var router = require('./routes/index');

// Set default rendering engine - TODO: remove this safely.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Set headers.
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));

app.use('/', router);

var User = require('./models/user');

// Allow user to authenticate
app.route('/api/authenticate')
  .post(function(req, res) {
    // find the user
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        // check if password matches
        if (user.password != req.body.password) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn : 60*60*24 // expires in 24 hours
          });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'You have received a token.',
            token: token
          });
        }
      }
    });
  })

  .get(function(req, res) {
    res.render('login', {
      layout: './partials/layout',
      title: 'Accessible Beacons'
    })
  });

// route middleware to verify a token
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('partials/error', {
    message: err.message,
    error: {},
    layout: './layout'
  });});

module.exports = app;
