'use strict';
var mongoose   = require('mongoose'),
    ObjectId   = mongoose.Schema.Types.ObjectId,
    relationship = require("mongoose-relationship");

var locationSchema = mongoose.Schema({
  name: String,
  text: String,
  beaconID: String,
  extNumber: Number,
  mapURL: String,
  phoneNumber: String,
  user: {
    type: ObjectId,
    ref: "User",
    childPath: "favourites"
  }
});

locationSchema.plugin(relationship, { relationshipPathName: 'user' });
module.exports = mongoose.model('Location', locationSchema);
