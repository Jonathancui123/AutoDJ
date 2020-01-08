const request = require('request');
const { songBank, users, selectedGenre, playlistDur, playlistID, Song, User } = require('./app');

function registerUser(code) {
    // Get user info
    request({
        url: 'https://api.spotify.com/v1/me',
        method: 'GET',
        headers: {
            'Authorization': code
        }
    }, (err, res, body) => {
        if (err) {
            console.log('Response error');
        } else {
            const info = JSON.parse(body);
            // Get current date and time
            const now = new Date();
            users.push(new User(
                Math.max.apply(Math, users.map(user => { return user.id; })),
                info.display_name,
                info.id,
                users.map(user => { return user.role; }).includes('host') ? 'guest' : 'host',
                now
            ));
            // console.log('Current users', users);
        }
    });
}

function getSongs(code) {
    request({
        url: 'https://api.spotify.com/v1/me/top/tracks',
        method: 'GET',
        headers: {
            'Authorization': code
        },
        body: 'limit=20'
    }, (err, res, body) => {
        if (err) {
            console.log('Error returned!');
        } else {
            var returnedSongs = res.items.sort((a, b) => {
                if (a.popularity < b.popularity) {
                    return 1;
                }
                if (a.popularity > b.popularity) {
                    return -1;
                }
                return 0;
            });
        }
        var i = 0;
        var matches = 0;
        while (matches < 3 && i < 20) {
            var genres = genreLookup(code, returnedSongs[i].artists[0]);
            if (genres.includes(selectedGenre)) {
                if (songBankLookup(returnedSongs[i].uri) >= 0) {
                    songBank[i].score++;
                } else {
                    songBank.push(new Song(
                        Math.max.apply(Math, users.map(user => { return user.id; })),
                        returnedSongs[i].name,
                        returnedSongs[i].artists[0],
                        genres,
                        1,
                        false,
                        returnedSongs[i].uri
                    ));
                }
            }
        }
    });
}

function genreLookup(code, artist) {
    request({
        url: `https://api.spotify.com/v1/artists/${artist.id}`,
        method: 'GET',
        headers: {
            Authorization: code
        }
    }, (err, res, body) => {
        return res.genres;
    });
}

function songBankLookup(uri) {
    for (let i = 0; i < songBank.length; i++) {
        if (uri === song.link) {
            return i;
        }
    }
    return -1;
}

function autoKick() {
    const now = new Date();
    var i = 0;
    while (users[i]) {
        if (now - users[i].joinTime > (60 * 60 * 1000)) {
            users.splice(i, 1);
        } else {
            i++;
        }
    };
}

module.exports = {
    registerUser: registerUser,
    getSongs: getSongs,
    genreLookup: genreLookup,
    songBankLookup: songBankLookup,
    autoKick: autoKick
};