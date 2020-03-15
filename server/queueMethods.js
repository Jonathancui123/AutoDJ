const rp = require("request-promise");
const request = require("request");

// Returns an array of all song objects from the main bank that have at least one of the selected genres
function createGenredBank(selectedGenres, songBank) {
  var genredBank = [];
  //Iterate through each song in the song bank

  for (var i = 0; i < songBank.length; i++) {
    var genresOfSong = songBank[i].genres;
    for (var j = 0; j < selectedGenres.length; j++) {
      if (genresOfSong.includes(selectedGenres[j])) {
        //Genre j is tagged in the song
        genredBank.push(songBank[i]);
        break;
      }
    }
  }

  return genredBank;
}

// Returns URI's of shortlisted songs, to fill the necessary duration
// Also mutates songBank to be sorted
function genShortListURI(songBank, playlistDur) {
  //Sort the song bank by popularity
  songBank.sort((a, b) => (a.score < b.score ? 1 : -1));
  var currPlaylistDur = 0;
  var i = 0;
  var shortList = [];
  while (currPlaylistDur < playlistDur) {
    //Check that there are songs remaining in the song Bank
    if (songBank[i] == undefined) {
      console.error(
        new Error("NOT ENOUGH SONGS IN BANK TO FILL PLAYLIST DURATION")
      );
      return shortList;
    }
    var nextSong = songBank[i];
    shortList.push(nextSong.link);
    console.log("Next song duration: ", nextSong.dur);
    currPlaylistDur += nextSong.dur;
    i++;
  }
  shortList.pop();
  console.log("Finished shortlist: ", shortList);
  return shortList;
}

function createNewPlaylist(auth_token, playlistName, userID) {
  var postOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + auth_token,
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

function addSongsToPlaylist(auth_token, songURIList, playlistID) {
  var options = {
    url: "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ uris: songURIList })
  };
  request.put(options, (err, res, body) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Successfully added songs to the playlist");
    }
  });
}

module.exports = {
  genShortListURI: genShortListURI,
  createNewPlaylist: createNewPlaylist,
  addSongsToPlaylist: addSongsToPlaylist,
  createGenredBank: createGenredBank
};
