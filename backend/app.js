// Modules
const express = require('express');
const path = require('path');
const rp = require('request-promise');
const request = require('request');
const cors = require('cors');
const config = require('./config/keys');
const bodyParser = require('body-parser');
const session = require('express-session');
const queueHelpers = require('./queueMethods');
const dbMethods = require('./dbMethods');

const app = express();
app.use(cors()); // Allow CORS
app.use(bodyParser.json()); // Parse body from front end POST requests
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "vagabond",
  cookie: { secure: false }
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', frontendAddress);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// DONT FORGET TO SET CLIENT SECRET IN ENV --> USE CMD (NOT POWERSHELL) AS ADMIN

// Environment vars
const clientId = "158a4f4cd2df4c9e8a8122ec6cc3863a";
const clientSecret = process.env.clientSecret;
const PORT = process.env.PORT || 3000;
const frontendAddress = config.frontendAddress;
const backendAddress = config.backendAddress;

///////////////////////////////////////////////
// GLOBAL VARIABLES
///////////////////////////////////////////////
var playlistID = "0vvXsWCC9xrXsKd4FyS8kM"; // Spotify ID for the playlist that is made - so it can be edited; default - Lofi beats
var nextSongId = 0;

function Song(id, name, artist, genres, score, played, link, duration) {
  this.id = id;
  this.name = name;
  this.artist = artist;
  this.genres = genres;
  this.score = score;
  this.played = played;
  this.link = link;
  this.dur = duration;
}

///////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

// Login Page - authorizing the app to get user data
app.get('/login', (req, res) => {
  var scopes =
    'user-read-private user-read-email playlist-modify-public user-top-read';
  console.log('login req received');
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
    'response_type=code' +
    '&client_id=' + clientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(backendAddress + '/loggedin')
  );
});

// Redirect after login
app.get('/loggedin', (req, res) => {
  console.log('* /loggedin called');
  console.log('Client secret ', clientSecret);

  var code = req.query.code;
  console.log('User code: ', code);

  addUser(code)
    .then((ret) => {
      req.session.userData = {
        id: ret
      };
      console.log(`Saved user id: ${req.session.userData.id}`);
      console.log(`Saved session id: ${req.session.id}`);
      res.redirect(frontendAddress + '/select');
    });
});

// Create new party
app.get('/newParty', (req, res) => {
  const reqBody = JSON.parse(req.body);
  const newPartyHost = dbMethods.makeNewPartyUser(reqBody.spotifyId, 'host')
    .then((host) => {
      const newPartyId = dbMethods.makeNewParty(newPartyHost);
    })
    .then(() => {
      req.session.role = 'host';
      req.session.party = newPartyId;
    })
    .then(() => {
      res.redirect(`${frontendAddress}/host`);
    })
    .catch(console.log('makeNewPartyUser failed'));
});

// Get user's info (name, spotifyId, parties)
app.get('/getUserInfo', (req, res) => {
  console.log('* /getUserInfo called');
  // console.log(req.session);
  // console.log(`Returned session id: ${req.session.id}`);
  dbMethods.getUserInfo(req.session.userData.id)
    .then((info) => {
      res.send(info);
    })
    .catch((err) => console.log('Could not get user info, ' + err));
});

// Create new playlist
app.post('/createPlaylist', (req, res) => {
  const playlistName = req.body.playlistName;
  const genres = req.body.genres.split("/");
  var userId = req.body.userId;
  playlistDur = 60 * 1000 * parseInt(req.body.duration);
  // console.log("Playlist duration in ms: " + playlistDur);

  console.log("CREATING NEW PLAYLIST");
  var tempBank = dbMethods.getSongBank(partyId);
  queueHelpers.createNewPlaylist(accessToken, playlistName, userId)
    .then(body => {
      console.log("Completed POST request for creating playlist");

      playlistID = JSON.parse(body).id;
      console.log("Playlist ID Response: " + playlistID);

      //Decide on songs and add it to the new playlist
      var genreOnlyBank = queueHelpers.createGenredBank(genres, tempBank);
      var shortListURI = queueHelpers.genShortListURI(genreOnlyBank, playlistDur);
      queueHelpers.addSongsToPlaylist(accessToken, shortListURI, playlistID)
        .then(body => {
          console.log("Playlist created and populated successfully");
          res.send({
            status: "success"
          });
        });
    })
    .catch(err => {
      console.log("Error generating new playlist");
      console.error(err.message);
      res.send({
        status: "fail"
      });
    });
});

// Retrieves info about party - TODO: ADAPT FOR DATABASE INSTEAD OF GLOBAL LIST
// app.get("/getInfo", (req, res) => {
//   const info = dbMethods.getUserInfo(req.spotifyId)
//   res.send({
//     users: users,
//     playlistName: playlistName,
//     playlistID: playlistID,
//     playlistDur: playlistDur,
//     genres: genres
//   });
// });

//Run this every 59 mins to refresh the access token for the user
function refresh_access() {
  console.log("refreshing access with refresh token: ", refreshToken);
  request.post(
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://accounts.spotify.com/api/token",
      body:
        "grant_type=refreshToken&refreshToken=" +
        refreshToken +
        "&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret
    },
    (err, httpResponse, body) => {
      if (err) {
        console.error(err);
      }
      parsed = JSON.parse(body);
      accessToken = parsed.accessToken;
      console.log("access refreshed. New access token: ", accessToken);
    }
  );
}

app.post("/test", (req, res) => {
  console.log("Recieved test post request", req.body);
  res.send("Thank you sir");
});

///////////////////////////////////////////////
// USER LOGIN FUNCTIONS
///////////////////////////////////////////////

// Authorize a user and get their ACCESS TOKEN
function getToken(code) {
  console.log('* Running getToken');
  var reqOptions = {
    //Request access token by trading authorization code
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    url: "https://accounts.spotify.com/api/token",
    body:
      "grant_type=authorization_code&code=" + code +
      "&redirect_uri=" + encodeURIComponent(backendAddress + "/loggedin") +
      "&client_id=" + clientId +
      "&client_secret=" + clientSecret
  };

  const userInfoPromise = rp(reqOptions);
  return userInfoPromise;
}

// Get a user's PROFILE INFO
function getUserInfo(accessToken) {
  console.log("* Running getUserInfo");
  console.log(`Access token: ${accessToken}`);
  var reqOptions = {
    headers: { "content-type": "application/x-www-form-urlencoded" },
    url: "https://api.spotify.com/v1/me",
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    }
  };

  var regPromise = rp(reqOptions);
  return regPromise;
}

// Add a user to database
async function addUser(code) {
  console.log("* Running addUser");
  var tokenInfo = await getToken(code);
  tokenInfo = await JSON.parse(tokenInfo);
  var userInfo = await getUserInfo(tokenInfo.access_token);
  userInfo = await JSON.parse(userInfo);

  // If user is not in database yet, add them
  if (!await dbMethods.getUsers(userInfo.id)) {
    await dbMethods.makeNewUser(userInfo.display_name, userInfo.id, userInfo.uri, tokenInfo.access_token, tokenInfo.refresh_token);
  } else {
    await dbMethods.updateTokens(userInfo.id, tokenInfo.access_token, tokenInfo.refresh_token);
  }

  // Get database index id of user
  var id = await dbMethods.getUserId(userInfo.id);
  return id;
}

///////////////////////////////////////////////
// SONG/PLAYLIST FUNCTIONS
///////////////////////////////////////////////

// Get user's top 100 songs (all genres)
function getSongs(accessToken) {
  console.log("Running getSongs");

  var reqOptions = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "content-Type": "application/json"
    },
    url: "https://api.spotify.com/v1/me/top/tracks?limit=100",
    method: "GET"
  };

  let getSongsPromise = rp(reqOptions);
  return getSongsPromise;
}

function addSongsToBank(body, partyId) {
  // List of songs in order of popularity
  var returnedSongs = JSON.parse(body).items.sort((a, b) => {
    if (a.popularity < b.popularity) {
      return 1;
    }
    if (a.popularity > b.popularity) {
      return -1;
    }
    return 0;
  });
  console.log("Finished getting and sorting songs");

  var tempBank = [];

  const finishedSongBank = new Promise((resolve, reject) => {
    var songCounter = 0; // Iterator for current song (need to go through all of them to tag genres)

    // Tag each song by genre
    Promise.all(returnedSongs.map(song => genreLookup(accessToken, song.artists[0])))
      .then(listOfArtistInfos => {
        listOfArtistInfos.forEach(artistInfo => {
          var temp_genres = JSON.parse(artistInfo).genres;
          var index = songBankLookup(tempBank, returnedSongs[songCounter].uri);
          if (index >= 0) {
            tempBank[index].score++;
          } else {
            tempBank.push(
              new Song(
                nextSongId,
                returnedSongs[songCounter].name,
                returnedSongs[songCounter].artists[0],
                temp_genres,
                1,
                false,
                returnedSongs[songCounter].uri,
                returnedSongs[songCounter].duration_ms
              )
            );
            console.log(`${nextSongId}: ${returnedSongs[songCounter].name}`);
            nextSongId++;
          }
          songCounter++;
        });

        // console.log("Printing songbank: ");
        // tempBank.forEach(song => {
        //   console.log(song.name);
        // });

        updateSongs(tempBank, partyId);

        resolve(tempBank);
      })
      .catch(err => {
        console.log("GENRE LOOKUP ERROR: " + err);
        reject("Could not finish creating song bank");
      });
  });
  return finishedSongBank;
}

// Takes in the access token and an artist to look for, returns genre of song
function genreLookup(accessToken, artist) {
  let promise = rp({
    url: `https://api.spotify.com/v1/artists/${artist.id}`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    }
  });
  return promise;
}

// Returns index of song in song bank
function songBankLookup(songBank, uri) {
  for (let i = 0; i < songBank.length; i++) {
    if (uri === songBank[i].link) {
      return i;
    }
  }
  return -1;
}

function autoKick() { // TODO: REDESIGN - Does Spotify expiration kick 
  const now = new Date();
  var i = 0;
  while (users[i]) {
    if (now - users[i].joinTime > 60 * 60 * 1000) {
      users.splice(i, 1);
    } else {
      i++;
    }
  }
}

// Temporary function to reset server
app.get("/restartServer", (req, res) => {
  songBank = [];
  users = [];
  genres = [];
  playlistID = "0vvXsWCC9xrXsKd4FyS8kM"; //temp playlist
  nextUserId = 0;
  nextSongId = 0;

  //Host inputs:
  playlistDur = 20 * 60 * 1000; // Integer: time in ms
  playlistName = "";
  playlistURI = "";

  res.sendFile(path.join(__dirname + "/views/clear.html"));
});

app.listen(PORT, () => {
  console.log(`AutoDJ is running on port ${PORT}`);
});
