'use strict';
var mongoose   = require('mongoose'),
    ObjectId   = mongoose.Schema.Types.ObjectId,
    relationship = require("mongoose-relationship");

var schema = mongoose.Schema({
  name: String,
  text: String,
  beaconID: String,
  extNumber: Number,
  user: {
    type: ObjectId,
    ref: "User",
    childPath: "favourites"
  }
});

module.exports = mongoose.model('Location', schema);
