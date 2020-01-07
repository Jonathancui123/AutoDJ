const express = require('express');
const path = require('path');
const app = express();
const request = require('request');

const clientId = '158a4f4cd2df4c9e8a8122ec6cc3863a';
const clientSecret = process.env.clientSecret;
var access_token = '';
var refresh_token = '';

// const redirectUri = 

///////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////

// Homepage
app.get('/', (req, res) => {
    // console.log(clientId);
    // console.log(clientSecret);
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

//Authorizing the app to get user data
app.get('/login', (req, res) => {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent('http://localhost:3000/loggedin'));
});

app.get('/loggedin', (req, res) => {
    var code = req.query.code;
    // console.log(code);
    request.post({ //Request access token using client secret
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: 'https://accounts.spotify.com/api/token',
        body: 'grant_type=authorization_code' + '&code=' + code + 
        '&redirect_uri=http://localhost:3000/loggedin' +
        '&client_id=' + clientId +
        '&client_secret=' + clientSecret
    }, (err, httpResponse, body) => {
        var parsed = JSON.parse(body)
        access_token = parsed.access_token;
        refresh_token = parsed.refresh_token;
        console.log("BODY: ", body);
        console.log("refresh token: " + refresh_token)
        setInterval(refresh_access, (58*60000)); // Refreshes token every 58 minutes, it expires every 60
    })
    res.sendFile(path.join(__dirname + '/views/loggedin.html'));
})

//Run this every 59 mins to refresh the access token for the user
function refresh_access() {
    console.log("refreshing access with refresh token: ", refresh_token);
    request.post({
        headers : {'content-type': 'application/x-www-form-urlencoded'},
        url: 'https://accounts.spotify.com/api/token',
        body: 'grant_type=refresh_token' + 
        '&refresh_token=' + refresh_token +
        '&client_id=' + clientId +
        '&client_secret=' + clientSecret
    }, (err, httpResponse, body) => {
        if (err) {console.log("gg error");}
        parsed = JSON.parse(body);
        access_token = parsed.access_token;
        console.log("access refreshed. New access token: ", access_token );
    })
}


// TODO: Rejected login handling

// TODO: Get playlist from user

///////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})