const mongoose = require('mongoose');

// Schemas
const User = require('./models/User');
const Party = require('./models/Party');
const PartyUser = require('./models/PartyUser');
const Counter = require('./models/Counter');

// Database connection
const dbUrl = require('./config/keys.js').mongoURI;
mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db = mongoose.connection)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

///////////////////////////////////////////////
// USER METHODS
///////////////////////////////////////////////

// Store users to DB with the same signature as previous User() function
async function makeNewUser(name, spotifyId, uri, accessToken, refreshToken) {
    var tempId = await getNextCounter('users');
    var newUser = new User({
        _id: tempId,
        name: name,
        spotifyId: spotifyId,
        uri: uri,
        parties: [],
        accessToken: accessToken,
        refreshToken: refreshToken
    });
    await newUser.save().then(result => console.log('Saved to DB: ', result));
    return tempId;
}

async function makeNewParty(host, playlistName, playlistId) {
    var tempId = await getNextCounter('parties');
    var newParty = new Party({
        _id: tempId,
        members: [host],
        host: host,
        playlistName: playlistName,
        playlistId: playlistId
    });
    await newParty.save().then(result => console.log('Party saved to DB: ', result))
    return tempId;
}

function makeNewPartyUser(id, role) {
    var newPartyUser = new PartyUser({
        id: id,
        role: role,
        joinTime: Date.now()
    })
    return newPartyUser;
}

async function getUsers(id) {
    const users = await User.findOne({
        spotifyId: id
    });
    return typeof users !== 'undefined' && users;
}

async function getNextCounter(collection) {
    var result = await Counter.findOne({
        _id: collection
    });
    var promise = await Counter.updateOne({
        _id: collection
    }, {
        $inc: { 'value': 1 }
    });
    return result.value;
}

async function getUserId(spotifyId) {
    var result = await User.findOne({
        spotifyId: spotifyId
    });
    return result._id;
}

async function getUserInfo(id) {
    const info = await User.findOne({
        _id: id
    });
    return info;
}

async function getAccessToken(id) {
    const info = await User.findOne({
        _id: id
    });
    return info.accessToken;
}

async function getPartyInfo(playlistId) {
    const info = await Party.findOne({
        playlistId: playlistId
    });
    return info;
}

async function updateTokens(spotifyId, accessToken, refreshToken) {
    await User.updateOne({
        spotifyId: spotifyId
    }, {
        $set: {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    })
}

// TODO: Update party function (new spotify link, host, etc)

///////////////////////////////////////////////
// SONG/PLAYLIST METHODS
///////////////////////////////////////////////

async function updateSongs(tempBank, partyId) {
    var result = await Party.updateOne({
        _id: partyId
    }, {
        $set: { songs: tempBank }
    })
    return result;
}

async function getSongBank(partyId) {
    var result = await Party.find({
        _id: partyId
    }).select({
        songs: 1
    });
    return result;
}

module.exports = {
    makeNewUser: makeNewUser,
    makeNewParty: makeNewParty,
    makeNewPartyUser: makeNewPartyUser,
    getUsers: getUsers,
    getNextCounter: getNextCounter,
    getUserId: getUserId,
    getUserInfo: getUserInfo,
    getAccessToken: getAccessToken,
    getPartyInfo: getPartyInfo,
    updateTokens: updateTokens,
    updateSongs: updateSongs,
    getSongBank: getSongBank
}