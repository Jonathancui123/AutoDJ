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

// Get user's info (name, spotifyId, parties)
router.get('/getUserInfo', (req, res) => {
    console.log('* /getUserInfo called');
    console.log(req.session);
    console.log("session id: ", req.session.id)
    // console.log(`Returned session id: ${req.session.id}`);
    try {
        dbMethods.getUserInfo(req.session.userData.id)
            .then((info) => {
                res.send(info);
            })
            .catch((err) => console.log('Could not get user info, ' + err));
    }
    catch (err) {
        console.log(err.message);
    }
});

// Check if person is logged in (return true if logged in)
router.get('/checkLogin', (req, res) => {
    console.log('* /checkLogin called');
    res.send(req.session.userData ? true : false);
});

// Get current most popular albums
router.get('/getPopularAlbums', async (req, res) => {
    console.log('* /getPopularAlbums called');
    var albums = await dbMethods.getMostPopularAlbums();
    res.send(albums);
});

// Get current number of listeners and parties
router.get('/getCurrentStats', async (req, res) => {
    console.log('* /getCurrentStats called');
    var stats = await dbMethods.getCurrentStats();
    res.send(stats)
});

module.exports = router;