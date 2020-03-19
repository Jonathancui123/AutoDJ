const rp = require("request-promise");
const request = require("request");
const dbMethods = require('./dbMethods');

// Returns an array of all song objects from the main bank that have at least one of the selected genres
function createGenredBank(selectedGenres, songBank) {
  var genredBank = [];
  console.log("Running createGenredBank on genres: " + selectedGenres + " and the songBank: " + songBank);

  for (var i = 0; i < songBank.length; i++) {
    var genresOfSong = songBank[i].genres;
    for (var j = 0; j < selectedGenres.length; j++) {
      if (genresOfSong.toString().includes(selectedGenres[j])) {
        genredBank.push(songBank[i]);
        console.log("Adding to genre only bank: ", songBank[i]);
        break;
      }
    }
  }
  console.log("Genred bank: " + genredBank);
  return genredBank;
}

// Returns URI's of shortlisted songs, to fill the necessary duration
// Also mutates songBank to be sorted
function genShortListURI(songBank, playlistDur) {
  //Sort the song bank by popularity
  console.log("Running genShortListURI with given genreBank: ", songBank);
  songBank.sort((a, b) => (a.score < b.score ? 1 : -1));
  var currPlaylistDur = 0;
  var i = 0;
  var shortList = [];
  while (currPlaylistDur < playlistDur) {
    //Check that there are songs remaining in the song Bank
    if (songBank[i] == undefined) {
      console.log("NOT ENOUGH SONGS IN BANK TO FILL PLAYLIST DURATION");
      return shortList;
    }
    var nextSong = songBank[i];
    shortList.push(nextSong.link);
    console.log("Next song duration: " + nextSong.dur);
    currPlaylistDur += nextSong.dur;
    i++;
  }
  shortList.pop();
  console.log("Finished shortlist: " + shortList);
  return shortList;
}

function createNewPlaylist(authToken, playlistName, userID) {
  var postOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "content-type": "application/json"
    },
    url: "https://api.spotify.com/v1/users/" + userID + "/playlists",
    body: JSON.stringify({
      name: playlistName,
      public: true,
      description: "Playlist made by the coolest DJ in town"
    })
  };
  let promise = rp(postOptions);
  return promise;
}

function addSongsToPlaylist(authToken, songURIList, playlistID) {
  var options = {
    method: "PUT",
    url: "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ uris: songURIList })
  };
  const addSongsPromise = rp(options);
  return addSongsPromise;
}

module.exports = {
  genShortListURI: genShortListURI,
  createNewPlaylist: createNewPlaylist,
  addSongsToPlaylist: addSongsToPlaylist,
  createGenredBank: createGenredBank
};
