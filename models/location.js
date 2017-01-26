'use strict';
var mongoose   = require('mongoose'),
    ObjectId   = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  name: String,
  text: String
});

module.exports = mongoose.model('Location', schema);
