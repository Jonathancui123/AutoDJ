const request = require('request');

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
    var playlistID = 'NULL';
    request.post({
        headers : {'Authorization' : auth_token, 'Content-type' : 'application/json'},
        url: "https://api.spotify.com/v1/users/" + userID + "/playlists",
        body: {
            name: playlistName,
            public: true,
            description: "Playlist made by the coolest DJ in town"
        }
    }, (err, HTTPResponse, body) => {
        if (err) {
            console.log("Error creating new playlist")
        }else{
            var playlistObj = JSON.parse(body)
            playlistID = playlistObj.id;
        }
    })
    return playlistID
}

module.exports = {
    genShortListURI : genShortListURI,
    createNewPlaylist : createNewPlaylist
}