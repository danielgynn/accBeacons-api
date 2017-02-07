var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hbs = require('express-hbs');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var app = express();

var configDB = require('./config/database.js');

if (app.get('env') === 'development') {
  // Specify local development database.
  mongoose.connect(configDB.development.url);
  app.set('superSecret', configDB.development.secret);
} else if (app.get('env') === 'production') {
  // Start by loading up all our mongoose models and connecting.
  // Specify production database.
  mongoose.connect(configDB.production.url);
  app.set('superSecret', configDB.production.secret);
}

// Import routes.
var index = require('./routes/index');
var users = require('./routes/users');
var locations = require('./routes/locations');
var authentication = require('./routes/authentication');
var api = require('./routes/api');

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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use('/', index);
app.use('/', users);
app.use('/', locations);
app.use('/', authentication);
app.use('/', api);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('partials/error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('partials/error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
