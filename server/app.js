const express = require("express");
const path = require("path");
const app = express();
const rp = require("request-promise");
const request = require("request");
const async = require("async");
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");


const userHelpers = require("./users");
const queueHelpers = require("./queue");

const PORT = process.env.PORT || 3000;
const clientId = "158a4f4cd2df4c9e8a8122ec6cc3863a";
const clientSecret = process.env.clientSecret;
const frontendAddress = require("./config/keys").frontendAddress;
const backendAddress = require("./config/keys").backendAddress;
var access_token = "";
var guest_token = "";
var refresh_token = "";

//Allow CORS
app.use(cors());
//Parse body from front end POST requests
app.use(bodyParser.json());

// const redirectUri =

///////////////////////////////////////////////
// GLOBAL VARIABLES
///////////////////////////////////////////////
var songBank = [];
var users = [];
var genres = [];
var playlistID = "0vvXsWCC9xrXsKd4FyS8kM"; //Spotify ID for the playlist that is made - so it can be edited
var nextUserId = 0;
const songsPerPerson = 20;
var nextSongId = 0;

//Host inputs:
var playlistDur = 20 * 60 * 1000; // Integer: time in ms
var playlistName = "";
var playlistURI = "";

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

function User(id, name, spotifyId, role, uri, joinTime) {
  this.id = id;
  this.name = name;
  this.spotifyId = spotifyId;
  this.role = role;
  this.uri = uri;
  this.joinTime = joinTime;
}
///////////////////////////////////////////////
// DATABASE SETUP
///////////////////////////////////////////////
const db = require('./config/keys.js').mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

//Get the user class that user objects will inherit from
const UserClass = require("./models/User");

//Function to store users to DB with the same signature as previous User() function
function makeNewUser(id, name, spotifyId, role, uri, joinTime) {
  var newUser = new UserClass({
    autoDJId: id,
    name: name,
    spotifyId: spotifyId,
    uri: uri,
    parties: []
  })
  newUser.save()
    .then(result => console.log("Saved to DB: ", result))
}

///////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////
// Homepage
app.get("/", (req, res) => {
  // console.log(clientId);
  // console.log(clientSecret);
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

//Authorizing the app to get user data
app.get("/login", (req, res) => {
  var scopes =
    "user-read-private user-read-email playlist-modify-public user-top-read";
  console.log("login req received");
  res.redirect(
    "https://accounts.spotify.com/authorize" +
    "?response_type=code" +
    "&client_id=" +
    clientId +
    (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
    "&redirect_uri=" +
    encodeURIComponent(backendAddress + "/loggedin")
  );
  // frontEndAddress + "/create"
});

app.get("/loggedin", (req, res) => {
  console.log("Client secret ", clientSecret);

  var code = req.query.code;
  console.log("code: ", code);
  // console.log(code);



  reqUserInfo(code, clientId, clientSecret)
    .then(body => {
      var parsed = JSON.parse(body);
      if (users.length > 0) {
        guest_token = parsed.access_token;
      } else {
        access_token = parsed.access_token;
      }
      refresh_token = parsed.refresh_token;
      console.log("Access token reply: ", access_token);
      console.log("refresh token: " + refresh_token);

      /////////////////////////////////////
      //Register the user into our database and get query their songs
      /////////////////////////////////////
      setInterval(refresh_access, 58 * 60000); // Refreshes token every 58 minutes, it expires every 60
    })
    .catch(err => {
      console.log("Failed to req user info from Spotify: ", err.message);
    });
  // .then(() => console.log("Playlist ID: ", playlistID))
  // res.sendFile(path.join(__dirname + '/views/loggedin.html'));
  if (users.length > 0) {
    res.redirect(frontendAddress + "/host")
  } else {
    res.redirect(frontendAddress + "/create");
  }
});

function reqUserInfo(code, clientId, clientSecret) {
  var reqOptions = {
    //Request access token using client secret
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    url: "https://accounts.spotify.com/api/token",
    body:
      "grant_type=authorization_code" +
      "&code=" +
      code +
      "&redirect_uri=" +
      encodeURIComponent(backendAddress + "/loggedin") +
      "&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret
  };

  const userInfoPromise = rp(reqOptions);
  return userInfoPromise;
}

function conditionalRegUser() {
  if (users.length > 0) {
    return registerUser(guest_token)
  } else {
    return registerUser(access_token)
  }
}

function conditionalGetSongs() {
  console.log("Running conditional get songs");
  if (users.length > 1) {
    return getSongs(guest_token)
  } else {
    return getSongs(access_token)
  }
}

app.get("/clientRegisterUser", (req, res) => {
  console.log("Received Registration GET request from client");
  conditionalRegUser()
    .then(body => {
      const info = JSON.parse(body);
      // console.log('Response ', info);
      // Get current date and time
      const now = new Date();
      console.log("Current users: ", users);


      for (var i = 0; i < users.length; i++) {
        if (info.id == users[i].spotifyId) {
          console.log("Blocking 2nd registrtion attempt and sending response")
          res.send({
            display_name: info.display_name,
            spotifyID: info.id
          });
          return;
        }
      }
      makeNewUser(nextUserId, info.display_name, info.id, users
        .map(user => {
          return user.role;
        })
        .includes("host")
        ? "guest"
        : "host"
        , info.uri, now);

      users.push(
        new User(
          nextUserId,
          info.display_name,
          info.id,
          users
            .map(user => {
              return user.role;
            })
            .includes("host")
            ? "guest"
            : "host",
          info.uri,
          now
        )
      );
      nextUserId++;


      // console.log('Current users', users);
      /////////////////////////////////////
      // Get their songs now
      /////////////////////////////////////

      res.send({
        display_name: info.display_name,
        spotifyID: info.id
      });



      conditionalGetSongs()
        .then(body => addSongsToBank(body))
        .then(bank => {
          console.log("SONG BANK SUCCESSFULLY UPDATED");
        })
        .catch(err => console.error(err));
    })
    .catch(err => {
      console.log("Registration error - possibly due to second host login attempt");
      res.send({
        status: "meaningless response to trigger react refresh"
      });
    });
});

app.post("/test", (req, res) => {
  console.log("Recieved test post request", req.body);
  res.send("Thank you sir");
});

app.post("/updatePlaylist", (req, res) => {
  // genres = req.body.genres.split(" ")
  console.log("running UPDATE playlist");

  var genreOnlyBank = queueHelpers.createGenredBank(genres, songBank);
  console.log("Printing the genre only bank: ")
  genreOnlyBank.forEach(song => {
    console.log(song.name);
  })
  var shortListURI = queueHelpers.genShortListURI(
    genreOnlyBank,
    playlistDur
  );


  queueHelpers.addSongsToPlaylist(access_token, shortListURI, playlistID)
    .then(body => {
      console.log("Successfully added songs to the playlist");
      res.send({
        status: "successs"
      })
    })
})

app.post("/createPlaylist", (req, res) => {
  playlistName = req.body.playlistName;
  genres = req.body.genres.split("/");
  var userID = req.body.userID;
  playlistDur = 60 * 1000 * parseInt(req.body.duration);
  console.log("Playlist duration in ms: ", playlistDur)

  console.log("running create new playlist");

  queueHelpers
    .createNewPlaylist(access_token, playlistName, userID)
    .then(body => {
      console.log("completed post request for creating playlist");

      playlistID = JSON.parse(body).id;
      console.log("response ID: ", playlistID);

      //Decide on songs and add it to the new playlist
      var genreOnlyBank = queueHelpers.createGenredBank(genres, songBank);
      var shortListURI = queueHelpers.genShortListURI(
        genreOnlyBank,
        playlistDur
      );
      queueHelpers.addSongsToPlaylist(access_token, shortListURI, playlistID)
        .then(body => {
          console.log("Playlist created and populated successfully");
          res.send({
            status: "success"
          });
        })

    })
    .catch(err => {
      console.log("Error generating new playlist");
      console.error(err.message);
      res.send({
        status: "fail"
      });
    });
});


app.get("/getInfo", (req, res) => {
  res.send({
    users: users,
    playlistName: playlistName,
    playlistID: playlistID,
    playlistDur: playlistDur,
    genres: genres
  });
});

//Run this every 59 mins to refresh the access token for the user
function refresh_access() {
  console.log("refreshing access with refresh token: ", refresh_token);
  request.post(
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://accounts.spotify.com/api/token",
      body:
        "grant_type=refresh_token" +
        "&refresh_token=" +
        refresh_token +
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
      access_token = parsed.access_token;
      console.log("access refreshed. New access token: ", access_token);
    }
  );
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
  console.log("Running register user");
  // Get user info
  console.log("access token ", access_token);
  var reqOptions = {
    headers: { "content-type": "application/x-www-form-urlencoded" },
    url: "https://api.spotify.com/v1/me",
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token
    }
  };

  let regPromise = rp(reqOptions);
  return regPromise;
}

function getSongs(access_token) {
  console.log("Running get songs");

  var reqOptions = {
    headers: {
      Authorization: "Bearer " + access_token,
      "content-Type": "application/json"
    },
    url: "https://api.spotify.com/v1/me/top/tracks" + "?limit=100",
    method: "GET"
    // body: JSON.stringify({ limit: 100 })
  };

  let getSongsPromise = rp(reqOptions);
  return getSongsPromise;
}

function addSongsToBank(body) {
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
  // console.log("Sorted songs: ", returnedSongs);

  const finishedSongBank = new Promise((resolve, reject) => {
    var songCounter = 0;

    // returnedSongs.forEach(song => {
    //     console.log(song.artists[0]);
    // })

    Promise.all(
      returnedSongs.map(song => genreLookup(access_token, song.artists[0]))
    ) // All (genreLookups go in here)
      //Once all genre lookups have finished:
      .then(listOfArtistInfos => {
        listOfArtistInfos.forEach(artistInfo => {
          var temp_genres = JSON.parse(artistInfo).genres;
          var index = songBankLookup(returnedSongs[songCounter].uri);
          if (index >= 0) {
            songBank[index].score++;
          } else {
            songBank.push(
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
            console.log(
              nextSongId,
              "th song: ",
              returnedSongs[songCounter].name
            );
            nextSongId++;
          }
          songCounter++;
        });
        console.log("Printing songbank: ")
        songBank.forEach(song => {
          console.log(song.name);
        })

        resolve(songBank);
      })
      .catch(err => {
        console.log("GENRE LOOKUP ERROR");
        console.error(err);
        reject("Could not finish creating song bank");
      });
  });
  return finishedSongBank;
}
//Takes in the access token and an artist to look for
function genreLookup(access_token, artist) {
  let promise = rp({
    url: `https://api.spotify.com/v1/artists/${artist.id}`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  return promise;
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
    if (now - users[i].joinTime > 60 * 60 * 1000) {
      users.splice(i, 1);
    } else {
      i++;
    }
  }
}

// Make a array of song URIs (by descending order of score) until playlist length is equal to requested length --> CASE: if there are more songs needed than in the bank
// TODO: Order the songs by BPM/Pitch/Something useful
// TODO: Perform a check to see if the saved spotify ID exists as a playlist
// TODO: Allow naming of the playlist

//Temporary function to reset server
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
  console.log(`Our app is running on port ${PORT}`);
});
