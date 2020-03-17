const mongoose = require("mongoose");

//Defines the user schema for mongoose
const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  spotifyId: String,
  uri: String,
  parties: [String],
  accessToken: String,
  refreshToken: String
});

//Returns a CLASS of object with the above schema
// const User = mongoose.model("User", userSchema);
const User = mongoose.model("users", userSchema);
module.exports = User;