'use strict';
var mongoose = require('mongoose'),
  ObjectId   = mongoose.Schema.Types.ObjectId;
// var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  admin: Boolean
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
