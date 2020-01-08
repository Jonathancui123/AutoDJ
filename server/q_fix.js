const rp = require("request-promise");


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

module.exports.createNewPlaylist = createNewPlaylist;