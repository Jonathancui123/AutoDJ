const mongoose = require("mongoose");

//Holds party specific data for each user
var partyUserSchema = new mongoose.Schema({
  spotifyId: String,
  role: String,
  joinTime: {
    type: Date,
    default: Date.now
  }
});

//Defines the party schema for mongoose
const partySchema = new mongoose.Schema({
  _id: Number,
  members: [partyUserSchema],
  host: partyUserSchema,
  songs: [String],
  playlistId: String

  //Hold songbank here
  //Created playlists here
});

//Returns a CLASS of object with the above schema
const Party = mongoose.model("parties", partySchema);
module.exports = {
  partyUserSchema: partyUserSchema,
  partySchema: partySchema,
  model: Party
};
