const mongoose = require("mongoose");

//Defines the user schema for mongoose
const userSchema = new mongoose.Schema({
  //   id: String,
  name: String,
  spotifyId: String,
  uri: String,
  parties: [String],
  access_token: String,
  refresh_token: String
});

//Returns a CLASS of object with the above schema
// const User = mongoose.model("User", userSchema);
const User = mongoose.model("users", userSchema);
module.exports = {
  schema: userSchema,
  model: User
};
