const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    _id: String,
    value: Number
});

const Counter = mongoose.model("counters", counterSchema);
module.exports = Counter;