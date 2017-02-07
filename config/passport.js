var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Allow local account creation and authentication with Passport.js
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'email':  email }, function(err, user) {
        if (err) {
          return done(err);
        } else if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
        } else {
          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) {
              throw err;
            } else {
              return done(null, newUser);
            }
          });
        }
      });
    });
  }));

  // Allow local authentication for registered users
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'email':  email }, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      } else if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Your password or email is incorrect.'));
      } else {
        return done(null, user);
      }
    });
  }));
};
