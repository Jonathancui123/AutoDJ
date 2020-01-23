const express = require('express');
const path = require('path');
const app = express();
const rp = require("request-promise");
const request = require('request');
const userHelpers = require('./users');
const queueHelpers = require('./q');
const async = require('async');
const cors = require('cors');

const clientId = '158a4f4cd2df4c9e8a8122ec6cc3863a';
const clientSecret = process.env.clientSecret;
const frontEndAddress = 'http://localhost:3001';
var access_token = '';
var refresh_token = '';

// const redirectUri = 

///////////////////////////////////////////////
// GLOBAL VARIABLES
///////////////////////////////////////////////
var songBank = [];
var users = [];
var playlistID = ''; //Spotify ID for the playlist that is made - so it can be edited
var nextUserId = 0;
const songsPerPerson = 10;
var nextSongId = 0;

//Host inputs:
var selectedGenre = 'rap';
var playlistDur = 10; // Integer: time in minutes
var playlistName = '';

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

//Allow CORS
app.use(cors())

// Homepage
app.get('/', (req, res) => {
    // console.log(clientId);
    // console.log(clientSecret);
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

//Authorizing the app to get user data
app.get('/login', (req, res) => {
    
    var scopes = 'user-read-private user-read-email playlist-modify-public user-top-read';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(frontEndAddress + "/create"));
});

app.get('/loggedin', (req, res) => {
    console.log('Client secret ', clientSecret);
    var code = req.query.code;
    // console.log(code);
    request.post({ //Request access token using client secret
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://accounts.spotify.com/api/token',
        body: 'grant_type=authorization_code' + '&code=' + code +
            '&redirect_uri=http://localhost:3001' +
            '&client_id=' + clientId +
            '&client_secret=' + clientSecret
    }, (err, httpResponse, body) => {
        var parsed = JSON.parse(body)
        access_token = parsed.access_token;
        refresh_token = parsed.refresh_token;
        console.log("Access token reply: ", access_token);
        console.log("refresh token: " + refresh_token)

        /////////////////////////////////////
        //Register the user into our database and get query their songs
        /////////////////////////////////////
        registerUser(access_token)
        .then((body) => {
            const info = JSON.parse(body);
            // console.log('Response ', info);
            // Get current date and time
            const now = new Date();
            users.push(new User(
                nextUserId,
                info.display_name,
                info.id,
                users.map(user => { return user.role; }).includes('host') ? 'guest' : 'host',
                now
            ));
            nextUserId++;
            // console.log('Current users', users);
            /////////////////////////////////////
            // Get their songs now
            /////////////////////////////////////
            getSongs(access_token);
        })
        .catch((err)=>{
            console.error(new Error("Registration error"));
        })
               
       
        setInterval(refresh_access, (58 * 60000)); // Refreshes token every 58 minutes, it expires every 60
    })
    // .then(() => console.log("Playlist ID: ", playlistID))
    // res.sendFile(path.join(__dirname + '/views/loggedin.html'));
    res.redirect("localhost:3001/create");
})

app.get('/test', (req, res)=>{
    res.send({URI: "SERVED FROM SERVER"})
})


 /* 
        /////////////////////////////////////
        // DO NOT DELETE 
        // MAKING A NEW PLAYLIST: This should run when the user clicks "Create playlist"
        /////////////////////////////////////
        
         queueHelpers.createNewPlaylist(access_token,"hehexd","frozendarkmatter")
             .then((body)=>{
                 console.log("completed post request for creating playlist")
                 
                 playlistID = JSON.parse(body).id;
                 console.log("response ID: ", playlistID);
             })
             .catch((err)=>{
                 console.error(err);
             })
         var shortListURI = queueHelpers.genShortListURI(songBank, playlistDur);
         queueHelpers.addSongsToPlaylist(access_token, shortListURI ,playlistID);
*/



//Run this every 59 mins to refresh the access token for the user
function refresh_access() {
    console.log("refreshing access with refresh token: ", refresh_token);
    request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://accounts.spotify.com/api/token',
        body: 'grant_type=refresh_token' +
            '&refresh_token=' + refresh_token +
            '&client_id=' + clientId +
            '&client_secret=' + clientSecret
    }, (err, httpResponse, body) => {
        if (err) { console.error(err); }
        parsed = JSON.parse(body);
        access_token = parsed.access_token;
        console.log("access refreshed. New access token: ", access_token);
    })
}


// TODO: Rejected login handling

// TODO: Get playlist from user

///////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////

// const regUserWrapper = new Promise((resolve, reject) => {
//     registerUser(access_token)
//         .then((body) => {
//             const info = JSON.parse(body);
//             // console.log('Response ', info);
//             // Get current date and time
//             const now = new Date();
//             users.push(new User(
//                 nextUserId,
//                 info.display_name,
//                 info.id,
//                 users.map(user => { return user.role; }).includes('host') ? 'guest' : 'host',
//                 now
//             ));
//             nextUserId++;
//             // console.log('Current users', users);
//         })
//         .catch((err)=>{
//             console.error(new Error("Registration error"));
//         })
// })

function registerUser(access_token) {
    console.log("Running register user")
    // Get user info
    console.log('access token ', access_token);
    var reqOptions = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://api.spotify.com/v1/me',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }

    let regPromise = rp(reqOptions);
    return regPromise
}

function getSongs(access_token) {
    console.log("Running get songs")
    request({
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'content-Type': 'application/json'
        },
        url: 'https://api.spotify.com/v1/me/top/tracks',
        method: 'GET',
        // body: JSON.stringify({limit:20})
    }, (err, res, body) => {
        if (err) {
            console.log('Error returned!');
        } else {
            console.log("Finished getting songs, starting sort")
            var returnedSongs = JSON.parse(body).items.sort((a, b) => {
                if (a.popularity < b.popularity) {
                    return 1;
                }
                if (a.popularity > b.popularity) {
                    return -1;
                }
                return 0;
            });
            // console.log("Finished sorting songs: ", returnedSongs);
        }
        var matches = 0;

        returnedSongs.forEach(song => {
            console.log('matches: ', matches);
            // console.log('i: ', i);
            var genres = [];
            console.log("i'th song: ", song.name);
            genreLookup(access_token, song.artists[0])
                .then((body) => {
                    genres = JSON.parse(body).genres
                    console.log("Artist genre: ", genres, " Selected Genre: ", selectedGenre);
                    if (genres.includes(selectedGenre)) {
                        ++matches;
                        var index = songBankLookup(song.uri)
                        if (matches <= songsPerPerson) {
                            if (index >= 0) {
                                songBank[index].score++;
                            } else {
                                songBank.push(
                                    new Song(
                                        nextSongId,
                                        song.name,
                                        song.artists[0],
                                        genres,
                                        1,
                                        false,
                                        song.uri)
                                );
                                nextSongId++;
                            }
                        }

                    }
                    // console.log("OUR SONG BANK: ", songBank);
                })
        })
        // }


    });
}

function genreLookup(access_token, artist) {
    let promise = rp({
        url: `https://api.spotify.com/v1/artists/${artist.id}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    });
    return promise
}


function songBankLookup(uri) {
    for (let i = 0; i < songBank.length; i++) {
        if (uri === songBank[i].link) {
            return i;
        }
    }
    return -1;
}

function autoKick() {
    const now = new Date();
    var i = 0;
    while (users[i]) {
        if (now - users[i].joinTime > (60 * 60 * 1000)) {
            users.splice(i, 1);
        } else {
            i++;
        }
    };
}

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