var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
// var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(function(email, password, done) {
    User.findOne({ 'local.email': email }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if (isMatch) return done(null, user);
        return done(null, false);
      });
    });
  }))
};
