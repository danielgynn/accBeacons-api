var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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
app.set('view engine', 'jade');

// Set headers.
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // res.setHeader("Content-Type", "application/json");
  // res.header('superSecret', 'shh')
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Passport configurations.
// app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// Load passport config.
// require('./config/passport')(passport);

app.use('/', router);

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
  res.render('error');
});

module.exports = app;
