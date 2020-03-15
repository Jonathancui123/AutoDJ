const mongoose = require("mongoose");

//Holds party specific data for each user
var partyUserSchema = new mongoose.Schema({
    autoDJId: String,
    name: String,
    spotifyId: String,

    role: String,
    joinTime: {
        type: Date,
        default: Date.now
    }
})



//Defines the party schema for mongoose
const partySchema = new mongoose.Schema({
    partyId: String,
    members: [partyUserSchema],
    host: partyUserSchema

    //Hold songbank here
    //Created playlists here
})

//Returns a CLASS of object with the above schema
Party = mongoose.model('Party', partySchema);
module.exports = Party;