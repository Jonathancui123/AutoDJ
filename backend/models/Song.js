const mongoose = require("mongoose");

// Holds song data
var songSchema = new mongoose.Schema({
    id: Number,
    name: String,
    artist: String,
    genres: [String],
    score: Number,
    link: String,
    dur: Number
});

module.exports = songSchema;