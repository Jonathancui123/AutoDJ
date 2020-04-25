const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    id: String,
    name: String,
    artist: String,
    count: Number,
    art: String,
    link: String
});

const Album = mongoose.model("albums", albumSchema);
module.exports = Album;