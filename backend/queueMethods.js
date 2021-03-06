const rp = require("request-promise");
const request = require("request");
const dbMethods = require('./dbMethods');



// Returns an array of all song objects from the main bank that have at least one of the selected genres
function createGenredBank(selectedGenres, songBank) {
  console.log('* createGenredBank called');

  var genredBank = [];

  for (var i = 0; i < songBank.length; i++) {
    var genresOfSong = songBank[i].genres;
    for (var j = 0; j < selectedGenres.length; j++) {
      if (genresOfSong && genresOfSong.toString().includes(selectedGenres[j])) {
        genredBank.push(songBank[i]);
        // console.log("Adding to genre only bank: ", songBank[i]);
        break;
      }
    }
  }

  genredBank = genredBank.sort((a, b) => {
    if (a.popularity < b.popularity) {
      return 1;
    }
    if (a.popularity > b.popularity) {
      return -1;
    }
    return 0;
  });

  // console.log("Genred bank: " + genredBank);
  return genredBank;
}

// Returns URI's of shortlisted songs to fill the necessary duration, mutates songBank to be sorted
function genShortListURI(songBank, playlistDur) {
  // Sort song bank by popularity
  console.log('* genShortListURI called');
  songBank.sort((a, b) => (a.score < b.score ? 1 : -1));
  var currPlaylistDur = 0;
  var i = 0;
  var shortList = [];
  while (currPlaylistDur < playlistDur) {
    // Check that there are songs remaining in the song Bank
    if (songBank[i] == undefined) {
      console.log("NOT ENOUGH SONGS IN BANK TO FILL PLAYLIST DURATION");
      return shortList;
    }
    var nextSong = songBank[i];
    shortList.push(nextSong.link);
    currPlaylistDur += nextSong.dur;
    i++;
  }
  shortList.pop();
  console.log("Finished shortlist: " + shortList);
  return shortList;
}

function createNewPlaylist(accessToken, playlistName, userId) {
  console.log('* createNewPlaylist called')
  var postOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "content-type": "application/json"
    },
    url: "https://api.spotify.com/v1/users/" + userId + "/playlists",
    body: JSON.stringify({
      name: playlistName,
      public: true,
      description: "Playlist made by the coolest DJ in town"
    })
  };
  let promise = rp(postOptions);
  return promise;
}

function addSongsToPlaylist(accessToken, songURIList, playlistID) {
  var options = {
    method: "PUT",
    url: "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ uris: songURIList })
  };
  const addSongsPromise = rp(options);
  return addSongsPromise;
}

async function addSongsToPlaylist(accessToken, songURIList, playlistID) {
  var options = {
    method: "PUT",
    url: "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ uris: songURIList })
  };
  let addSongsPromise = rp(options)
  addSongsPromise.then(res => {
    return res;
  })
    .catch(err => {
      console.log('ERROR: (addSongsToPlaylist) Could not push songs to Spotify playlist')
      return err;
    })
}

// Get user's top 100 songs (all genres)
function getSongs(accessToken) {
  console.log("* getSongs called");

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

function addSongsToBank(body, accessToken) {
  var nextSongId = 0;

  // List of songs in order of popularity
  var returnedSongs = JSON.parse(body).items;
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
              {
                id: nextSongId,
                name: returnedSongs[songCounter].name,
                artist: returnedSongs[songCounter].artists[0].name,
                genres: temp_genres,
                score: 1,
                link: returnedSongs[songCounter].uri,
                dur: returnedSongs[songCounter].duration_ms,
                popularity: returnedSongs[songCounter].popularity
              }
            );
            console.log(`${nextSongId}: ${returnedSongs[songCounter].name}`);
            nextSongId++;
          }
          songCounter++;
        });

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

// Follow a playlist (add to Spotify)
function followPlaylist(playlistId, accessToken) {
  console.log("* followPlaylist called");

  let reqOptions = {
    url: `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    }
  };
  let reqPromise = rp(reqOptions);
  return reqPromise;
}

// Check whether user is following playlist
function checkFollowPlaylist(playlistId, spotifyId, accessToken) {
  console.log("* checkFollowPlaylist called");

  let reqOptions = {
    url: `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${spotifyId}`,
    method: "GET",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    }
  };
  let reqPromise = rp(reqOptions);
  reqPromise
    .then(res => { return res; })
    .catch(err => console.log(err.error));

  return reqPromise;
}

module.exports = {
  genShortListURI: genShortListURI,
  createNewPlaylist: createNewPlaylist,
  addSongsToPlaylist: addSongsToPlaylist,
  createGenredBank: createGenredBank,
  getSongs: getSongs,
  addSongsToBank: addSongsToBank,
  followPlaylist: followPlaylist,
  checkFollowPlaylist: checkFollowPlaylist
};
