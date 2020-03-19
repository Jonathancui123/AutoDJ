const mongoose = require('mongoose');

//Holds party specific data for each user
var partyUserSchema = new mongoose.Schema({
    name: String,
    spotifyId: String,
    role: String,
    uri: String,
    joinTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = partyUserSchema;