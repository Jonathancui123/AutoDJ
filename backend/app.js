// Modules
const express = require('express');
const path = require('path');
const rp = require('request-promise');
const request = require('request');
const cors = require('cors');
const config = require('./config/keys');
const bodyParser = require('body-parser');
const session = require('express-session');
const queueMethods = require('./queueMethods');
const dbMethods = require('./dbMethods');

// DONT FORGET TO SET CLIENT SECRET IN ENV --> USE CMD (NOT POWERSHELL) AS ADMIN

// Environment vars
const clientId = "158a4f4cd2df4c9e8a8122ec6cc3863a";
const clientSecret = process.env.clientSecret;
const PORT = process.env.PORT || 3000;
const frontendAddress = config.frontendAddress;
const backendAddress = config.backendAddress;

const app = express();
app.use(cors({
  origin: frontendAddress,
  credentials: true
})); // Allow CORS
app.use(bodyParser.json()); // Parse body from front end POST requests
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "vagabond",
  cookie: { secure: false }
}));
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': frontendAddress,
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': true
  });
  next();
});

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

// Create new party/playlist
app.post('/newParty', async (req, res) => {
  console.log('* /newParty called');
  const playlistName = req.body.playlistName;
  const genres = req.body.genres.split("/");
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
  const partyId = await dbMethods.makeNewParty(host, playlistName, playlistId);
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

app.get('/getPartyInfo/:playlistId', async (req, res) => {
  console.log(`* /getPartyInfo/${req.params.playlistId} called`);
  const playlistId = req.params.playlistId;
  const partyInfo = await dbMethods.getPartyInfo(playlistId);
  console.log(partyInfo);
  res.send(partyInfo);
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
