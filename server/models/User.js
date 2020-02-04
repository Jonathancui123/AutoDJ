const mongoose = require("mongoose");

//Defines the user schema for mongoose
const userSchema = new mongoose.Schema({
    autoDJId: String,
    name: String,
    spotifyId: String,
    role: String,
    uri: String,
    joinTime: {
        type: Date,
        default: Date.now
    }
})

//Returns a CLASS of object with the above schema
User = mongoose.model('User', userSchema);
module.exports = User;