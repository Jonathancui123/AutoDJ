const rp = require("request-promise");
const request = require("request");

// Returns URI's of shortlisted songs
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
            console.log("Added songs to the playlist");
        }
    })
}

module.exports = {
    genShortListURI : genShortListURI,
    createNewPlaylist : createNewPlaylist,
    addSongsToPlaylist : addSongsToPlaylist
}