const mongoose = require("mongoose");
const partyUserSchema = require('./PartyUser');
const songSchema = require('./Song');

//Defines the party schema for mongoose
const partySchema = new mongoose.Schema({
  _id: Number,
  members: [partyUserSchema],
  host: partyUserSchema,
  playlistName: String,
  playlistId: String,
  genres: Object,
  duration: Number,
  songs: [songSchema]
});

//Returns a CLASS of object with the above schema
const Party = mongoose.model("parties", partySchema);
module.exports = Party;
