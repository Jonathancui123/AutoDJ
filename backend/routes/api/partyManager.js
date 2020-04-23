// Third Party
const express = require('express');
const path = require('path');
const rp = require('request-promise');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const queueMethods = require('../../queueMethods');
const dbMethods = require('../../dbMethods');
const config = require('../../config/keys');
const router = express.Router();

// Get party's info
router.get('/getPartyInfo/:playlistId', async (req, res) => {
    console.log(`* /getPartyInfo/${req.params.playlistId} called`);
    const playlistId = req.params.playlistId;
    const partyInfo = await dbMethods.getPartyInfo(playlistId);
    console.log("Party info: ", partyInfo);
    res.send(partyInfo);
});

// Check if current user is the host of the party - Is it req.params or req.query?
router.get('/isPartyHost/:playlistId', async (req, res) => {
    console.log(`* /isPartyHost/${req.params.playlistId} called`);
    const playlistId = req.params.playlistId;
    const partyInfo = await dbMethods.getPartyInfo(playlistId);
    console.log("req session id: ", req.session.id)
    console.log("req.session.userdata.spotifyId: ", req.session.userData.spotifyId)
    console.log("partyInfo.host.spotifyId: ", partyInfo.host.spotifyId)

    var partyAndHostInfo = JSON.parse(JSON.stringify(partyInfo))
    partyAndHostInfo.isHost = ((req.session.userData.spotifyId == partyAndHostInfo.host.spotifyId) ? true : false);
    console.log("Returning partyAndHostInfo: ", partyAndHostInfo);
    res.send(partyAndHostInfo);
});

// Create new party/playlist
router.post('/newParty', async (req, res) => {
    console.log('* /newParty called');
    console.log("session id: ", req.session.id)

    const playlistName = req.body.playlistName;
    const genres = req.body.genres.concat(req.body.others.split(",").map(str => str.trim()));
    const playlistDur = 60 * 1000 * parseInt(req.body.duration);
    const retrievedUserData = await dbMethods.getUserInfo(req.session.userData.id);
    const accessToken = retrievedUserData.accessToken;
    const userId = retrievedUserData.spotifyId;
    console.log('Variable declaration done');
    console.log(`Access token: ${accessToken}`);
    console.log(`Playlist name: ${playlistName}`);
    console.log(`User ID: ${userId}`);

    // Generate new playlist
    var tempBank = await queueMethods.getSongs(accessToken);
    tempBank = await queueMethods.addSongsToBank(tempBank, accessToken);
    console.log(tempBank.slice(0, 10));
    var createdPlaylist = await queueMethods.createNewPlaylist(accessToken, playlistName, userId);
    const playlistId = JSON.parse(createdPlaylist).id;
    console.log(`Playlist ID: ${playlistId}`);
    var genreOnlyBank = queueMethods.createGenredBank(genres, tempBank);
    var shortListURI = queueMethods.genShortListURI(genreOnlyBank, playlistDur);
    console.log('Playlist generated');

    // Make new party & host object
    const host = await dbMethods.makeNewPartyUser(userId, 'host');
    const partyId = await dbMethods.makeNewParty(host, playlistName, playlistId, genres.toString(), playlistDur);
    console.log('Party created');

    // Add party to current user's profile
    await dbMethods.addParty(req.session.userData.id, playlistId);

    try {
        await queueMethods.addSongsToPlaylist(accessToken, shortListURI, playlistId);
        res.send({
            status: "success",
            playlistId: playlistId
        });
    } catch {
        console.log('Could not add songs to playlist');
        res.send({
            status: "fail"
        });
    }
});

// Update current playlist
router.put('/updatePlaylist', async (req, res) => {
    console.log('* /updatePlaylist called');
    console.log("session id: ", req.session.id)

    const playlistName = req.body.playlistName;
    const genres = req.body.genres.concat(req.body.others.split(",").map(str => str.trim()));
    const playlistId = req.body.playlistId;
    const playlistDur = 60 * 1000 * parseInt(req.body.duration);
    const retrievedUserData = await dbMethods.getUserInfo(req.session.userData.id);
    const accessToken = retrievedUserData.accessToken;
    const userId = retrievedUserData.spotifyId;
    console.log('Variable declaration done');
    console.log(`Access token: ${accessToken}`);
    console.log(`Playlist name: ${playlistName}`);
    console.log(`User ID: ${userId}`);
    console.log(`Playlist ID: ${playlistId}`);

    // Create new shortlist
    var tempBank = await queueMethods.getSongs(accessToken);
    tempBank = await queueMethods.addSongsToBank(tempBank, accessToken);
    console.log(tempBank.slice(0, 10));
    var genreOnlyBank = queueMethods.createGenredBank(genres, tempBank);
    var shortListURI = queueMethods.genShortListURI(genreOnlyBank, playlistDur);
    console.log('Playlist generated');

    // Update database entry for party
    await dbMethods.updateParty(playlistName, playlistId, req.body.genres, playlistDur);

    try {
        await queueMethods.addSongsToPlaylist(accessToken, shortListURI, playlistId);
        res.send({
            status: "success",
            playlistId: playlistId
        });
    } catch {
        console.log('Could not add songs to playlist');
        res.send({
            status: "fail"
        });
    }
});

// Join a party
router.post('/joinParty/:playlistId', async (req, res) => {
    console.log(`* /joinParty/${req.query.playlistId} called`);
    const partyMembers = await dbMethods.getPartyInfo(req.query.playlistId).members;
    partyMembers = partyMembers.map(member => member.spotifyId);
    if (!partyMembers.include(req.session.userData.spotifyId)) {
        await dbMethods.joinParty(req.session.userData.spotifyId, req.query.playlistId);
    }
});

module.exports = router;