'use strict';
var mongoose = require('mongoose'),
  ObjectId   = mongoose.Schema.Types.ObjectId,
  relationship = require("mongoose-relationship");
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
  admin: Boolean,
  darkTheme: Boolean,
  inverted: Boolean,
  largeFont: Boolean,
  favourites: [{
    location: {
      type: ObjectId,
      ref: "Location"
    },
    data: {
      name: String,
      text: String,
      extNumber: Number
    }
  }],
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
