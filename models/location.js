'use strict';
var mongoose   = require('mongoose'),
    ObjectId   = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  name: String,
  text: String,
  beaconID: String,
  extNumber: Number
});

module.exports = mongoose.model('Location', schema);
