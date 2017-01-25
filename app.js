var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// var index = require('./routes/index');
// var locations = require('./routes/locations');

var app = express();

// Configure MongoDB database instance.
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

app.set('view engine', 'jade');

var locationSchema = new mongoose.Schema({
	name: 'string',
	text: 'string'
});

var LocationModel = mongoose.model('location',locationSchema);

app.get('/api/', function(req, res, next) {
  res.send('working');
});

/* GET users listing. */
app.get('/api/locations', function(req, res, next) {
  LocationModel.find({},function(err,docs) {
		if(err) {
			res.send(err);
		}
		else {
			res.send(docs);
		}
	});
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
  res.render('error');
});

module.exports = app;
