const mongoose = require("mongoose");
const Counter = require("./models/Counter");
const dbUrl = require("./config/keys").mongoURI;

mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db = mongoose.connection)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

Counter.remove({}, () => {
    console.log('Collection Counter cleared');
});

const partyCounter = new Counter({
    _id: "parties",
    value: "0"
});

const userCounter = new Counter({
    _id: "users",
    value: "0"
});

partyCounter.save().then(console.log("Party counter added"));
userCounter.save().then(console.log("User counter saved"));