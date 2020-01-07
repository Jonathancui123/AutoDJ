const express = require('express');
const path = require('path');
const app = express();
const request = require('request');
const userHelpers = require('./users');
const queueHelpers = require('./q');

const clientId = '158a4f4cd2df4c9e8a8122ec6cc3863a';
const clientSecret = process.env.clientSecret;
var access_token = '';
var refresh_token = '';

// const redirectUri = 

///////////////////////////////////////////////
// GLOBAL VARIABLES
///////////////////////////////////////////////
var songBank = [];
var users = [];
var playlistID = ''; //Spotify ID for the playlist that is made - so it can be edited

//Host inputs:
var selectedGenre = '';
var playlistDur = 10; // Integer: time in minutes
var playlistName = 'FillerName';

function Song(id, name, artist, tags, score, played, link) {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.tags = tags;
    this.score = score;
    this.played = played;
    this.link = link;
}

function User(id, name, spotifyId, role, joinTime) {
    this.id = id;
    this.name = name;
    this.spotifyId = spotifyId;
    this.role = role;
    this.joinTime = joinTime;
}

///////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////

// Homepage
app.get('/', (req, res) => {
    // console.log(clientId);
    // console.log(clientSecret);
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

//Authorizing the app to get user data
app.get('/login', (req, res) => {
    var scopes = 'user-read-private user-read-email playlist-modify-public';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent('http://localhost:3000/loggedin'));
});

app.get('/loggedin', (req, res) => {
    var code = req.query.code;
    // console.log(code);
    request.post({ //Request access token using client secret
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: 'https://accounts.spotify.com/api/token',
        body: 'grant_type=authorization_code' + '&code=' + code + 
        '&redirect_uri=http://localhost:3000/loggedin' +
        '&client_id=' + clientId +
        '&client_secret=' + clientSecret
    }, (err, httpResponse, body) => {
        var parsed = JSON.parse(body)
        access_token = parsed.access_token;
        refresh_token = parsed.refresh_token;
        console.log("Access token reply: ", body);
        console.log("refresh token: " + refresh_token)
        setInterval(refresh_access, (58*60000)); // Refreshes token every 58 minutes, it expires every 60
    })
    res.sendFile(path.join(__dirname + '/views/loggedin.html'));
})

//Run this every 59 mins to refresh the access token for the user
function refresh_access() {
    console.log("refreshing access with refresh token: ", refresh_token);
    request.post({
        headers : {'content-type': 'application/x-www-form-urlencoded'},
        url: 'https://accounts.spotify.com/api/token',
        body: 'grant_type=refresh_token' + 
        '&refresh_token=' + refresh_token +
        '&client_id=' + clientId +
        '&client_secret=' + clientSecret
    }, (err, httpResponse, body) => {
        if (err) {console.log("gg error");}
        parsed = JSON.parse(body);
        access_token = parsed.access_token;
        console.log("access refreshed. New access token: ", access_token );
    })
}


// TODO: Rejected login handling

// TODO: Get playlist from user

///////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////

// Make a array of song URIs (by descending order of score) until playlist length is equal to requested length --> CASE: if there are more songs needed than in the bank
// TODO: Order the songs by BPM/Pitch/Something useful
// TODO: Perform a check to see if the saved spotify ID exists as a playlist
// TODO: Allow naming of the playlist
// Create a new playlist and save the ID
// Add all tracks to the playlist ID by song URI's
// Return a WEB URL to the playlist

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})