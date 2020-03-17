const mongoose = require('mongoose');

//Holds party specific data for each user
var partyUserSchema = new mongoose.Schema({
    spotifyId: String,
    role: String,
    joinTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = partyUserSchema;