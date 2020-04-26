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
const app = require('../../app');


module.exports = function(app, getIOInstance){
    
    
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
    console.log("partyInfo.playlistName: ", partyInfo.playlistName)


    var partyAndHostInfo = JSON.parse(JSON.stringify(partyInfo))
    partyAndHostInfo.isHost = ((req.session.userData.spotifyId == partyAndHostInfo.host.spotifyId) ? true : false);
    // console.log("Returning partyAndHostInfo: ", partyAndHostInfo);
    res.send(partyAndHostInfo);
});

// Create new party/playlist
router.post('/newParty', async (req, res) => {
    console.log('* /newParty called');
    console.log("session id: ", req.session.id)

    const playlistName = req.body.playlistName;
    const genres = req.body.genres;
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
    console.log(JSON.parse(tempBank).items[0]);
    await dbMethods.addAlbums(tempBank);
    tempBank = await queueMethods.addSongsToBank(tempBank, accessToken);
    console.log(tempBank.slice(0, 10));
    var createdPlaylist = await queueMethods.createNewPlaylist(accessToken, playlistName, userId);
    const playlistId = JSON.parse(createdPlaylist).id;
    console.log(`Playlist ID: ${playlistId}`);

    // Make new party & host object
    const host = await dbMethods.makeNewPartyUser(userId, 'host');
    await dbMethods.makeNewParty(host, playlistName, playlistId, genres, playlistDur);
    await dbMethods.addSongs(tempBank, playlistId);
    console.log('Party created');

    // Filter out songs that fit genre preferences
    var retrievedSongBank = await dbMethods.getSongBank(playlistId);
    var genreOnlyBank = queueMethods.createGenredBank(genres, retrievedSongBank);
    var shortListURI = queueMethods.genShortListURI(genreOnlyBank, playlistDur);
    console.log('Playlist generated');

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



async function pushDBToSpotifyPlaylist(playlistId, accessToken, getIOInstance){
    console.log('* /pushDBToSpotifyPlaylist called');
    //Get info from DB about the party
    const partyInfo = await dbMethods.getPartyInfo(playlistId);
    const retrievedSongBank = partyInfo.songs;
    const genres = partyInfo.genres;
    const playlistDur = partyInfo.duration;
    
    // console.log(`Generating playlist at pushDBToSpotifyPlaylist with the following {genres: ${genres}, duration: ${playlistDur}}`)

    //Generate the playlist to push
    var genreOnlyBank = queueMethods.createGenredBank(genres, retrievedSongBank);
    var shortListURI = queueMethods.genShortListURI(genreOnlyBank, playlistDur);
    console.log('New playlist generated');

    //Push the playlist to Spotify 
    try{
        await queueMethods.addSongsToPlaylist(accessToken, shortListURI, playlistId);
        //Emit on socket
        
        console.log("getIOInstance(): ", getIOInstance())
     
        getIOInstance().to(playlistId).emit('updatedPlaylist')
        console.log('IO: Emitting update status to room', playlistId)
    }
    catch(err){
        console.log(err);
        console.log('ERROR: Could not push songs to Spotify playlist, emitting anyways');
        
        getIOInstance().to(playlistId).emit('updatedPlaylist')
        console.log('IO: Emitting update status to room', playlistId)
        return Promise.reject(new Error(400));
    }
    
}

// Update current playlist
router.put('/updatePlaylist', async (req, res) => {
    console.log('* /updatePlaylist called');
    console.log("session id: ", req.session.id)

    const playlistName = req.body.playlistName;
    // const genres = req.body.genres.concat(req.body.others.split(",").map(str => str.trim()));
    const genres = req.body.genres;
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

    // Update database entry for party
    await dbMethods.updateParty(playlistName, playlistId, genres, playlistDur);

    try {        
        await pushDBToSpotifyPlaylist(playlistId, accessToken, getIOInstance);
        res.send({
                    status: "success",
                    playlistId: playlistId
                });
                console.log("Sending response for update request")
    } catch {
        console.log('Could not add songs to playlist');
            res.send({
                status: "fail"
            });
    }

    // // Create new shortlist
    // var retrievedSongBank = await dbMethods.getSongBank(playlistId);
    // var genreOnlyBank = queueMethods.createGenredBank(genres, retrievedSongBank);
    // var shortListURI = queueMethods.genShortListURI(genreOnlyBank, playlistDur);
    // console.log('Playlist generated');
  

    // try {
    //     await queueMethods.addSongsToPlaylist(accessToken, shortListURI, playlistId);
    //     res.send({
    //         status: "success",
    //         playlistId: playlistId
    //     });
    //     console.log("Sending response for update request")
    // } catch {
    //     console.log('Could not add songs to playlist');
    //     res.send({
    //         status: "fail"
    //     });
    // }
});

// Join a party
router.post('/joinParty/:playlistId', async (req, res) => {
    console.log(`* /joinParty/${req.params.playlistId} called`);
    var partyMembers = await dbMethods.getPartyInfo(req.params.playlistId);
    partyMembers = partyMembers.members;
    console.log("partyMembers variable is: ", partyMembers);
    partyMembers = partyMembers.map(member => member.spotifyId);
    if (!partyMembers.includes(req.session.userData.spotifyId)) {
        await dbMethods.joinParty(req.session.userData.spotifyId, req.params.playlistId);

        const retrievedUserData = await dbMethods.getUserInfo(req.session.userData.id);
        const accessToken = retrievedUserData.accessToken;
        const userId = retrievedUserData.spotifyId;

        // Add songs to party in database
        var tempBank = await queueMethods.getSongs(accessToken);
        await dbMethods.addAlbums(tempBank);
        tempBank = await queueMethods.addSongsToBank(tempBank, accessToken);
        await dbMethods.addSongs(tempBank, req.params.playlistId);

        // Reflect new music taste in the spotify playlist and emit the change
        pushDBToSpotifyPlaylist(req.params.playlistId, accessToken, getIOInstance)
    }
});
    
    
    return router
}




// module.exports = router;