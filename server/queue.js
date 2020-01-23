const rp = require("request-promise");
const request = require("request");

// Returns an array of all song objects from the main bank that have at least one of the selected genres
function createGenredBank(selectedGenres, songBank)

var matches = 0;
console.log('matches: ', matches);
// console.log('i: ', i);
var genres = [];
console.log( nextSongId, "'th song: ", song.name);
genreLookup(access_token, song.artists[0])
    .then((body) => {
        genres = JSON.parse(body).genres
        console.log("Artist genre: ", genres, " Selected Genre: ", selectedGenre);
        if (genres.includes(selectedGenre)) { 
            ++matches;
            if (matches <= songsPerPerson) {
                
            }

        }
        // console.log("OUR SONG BANK: ", songBank);
    })

// Returns URI's of shortlisted songs, to fill the necessary duration
// Also mutates songBank to be sorted
function genShortListURI(songBank, playlistDur){
    //Sort the song bank by popularity 
    songBank.sort((a, b) => (a.score < b.score) ? 1 : -1)
    var currPlaylistDur = 0;
    var i = 0;
    var shortList = [];
    while(currPlaylistDur < playlistDur){
        //Check that there are songs remaining in the song Bank
        if (songBank[i] == undefined){
            return new Error("NOT ENOUGH SONGS IN BANK TO FILL PLAYLIST DURATION");
        }
        var nextSong = songBank[i];
        shortList.push(nextSong.link);
        currPlaylistDur += nextSong.dur;
        i++;
    }
    console.log("Finished shortlist: ", shortList);
    return shortList
}

function createNewPlaylist(auth_token, playlistName, userID){
    var postOptions = {
        method: 'POST',
        headers : {'Authorization' : 'Bearer ' + auth_token, 'content-type' : 'application/json'},
        url: "https://api.spotify.com/v1/users/" + userID + "/playlists",
        body: JSON.stringify({
            "name": playlistName,
            "public": true,
            "description": "Playlist made by the coolest DJ in town"
        }),
    }
    let promise = rp(postOptions);
    return promise;
}

function addSongsToPlaylist(auth_token, songURIList, playlistID){
    var options = {
        url: "https://api.spotify.com/v1/playlists/" + playlistID +"/tracks",
        headers : {
            "Authorization" : "Bearer " + auth_token,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({"uris": songURIList})
    }
    request.put(options,  (err, res, body)=>{
        if (err) {
            console.error(err)
        }else{
            console.log("Successfully added songs to the playlist");
        }
    })
}

module.exports = {
    genShortListURI : genShortListURI,
    createNewPlaylist : createNewPlaylist,
    addSongsToPlaylist : addSongsToPlaylist
}