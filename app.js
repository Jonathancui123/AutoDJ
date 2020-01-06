const express = require('express');
const path = require('path');
const app = express();

const clientId = '158a4f4cd2df4c9e8a8122ec6cc3863a';
const clientSecret = process.env.clientSecret;
// const redirectUri = 

///////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////

// Homepage
app.get('/', (req, res) => {
    console.log(clientId);
    console.log(clientSecret);
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

// TODO: Authorization
// app.get('/login', (req, res) => {
//     var scopes = 'user-read-private user-read-email';
//     res.redirect('https://accounts.spotify.com/authorize' +
//         '?response_type=code' +
//         '&client_id=' + clientId +
//         (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//         '&redirect_uri=' + encodeURIComponent('google.ca'));
// });

// TODO: Get playlist from user

///////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})