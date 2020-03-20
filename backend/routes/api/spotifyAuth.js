// const router = express.Router()
const express = require('express');
const rp = require('request-promise');


const dbMethods = require('../../dbMethods');
const config = require('../../config/keys');
const router = express.Router();

const clientSecret = config.clientSecret;
const clientId = config.clientId;
const frontendAddress = config.frontendAddress;
const backendAddress = config.backendAddress;
console.log("client id is:", clientId);
console.log("frontend address is:", frontendAddress);


// Login Page - authorizing the app to get user data
router.get('/login', (req, res) => {
    console.log(clientId);
    var scopes =
        'user-read-private user-read-email playlist-modify-public user-top-read';
    console.log('login req received');
    res.redirect(
        'https://accounts.spotify.com/authorize?' +
        'response_type=code' +
        '&client_id=' + clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(backendAddress + '/loggedin')
    );
});

// Redirect after login
router.get('/loggedin', (req, res) => {
    console.log('* /loggedin called');
    console.log('Client secret ', clientSecret);

    var code = req.query.code;
    console.log('User code: ', code);

    addUser(code)
        .then((ret) => {
            var id = ret.id
            var spotifyId = ret.spotifyId
            var access_token = ret.access_token

            req.session.userData = {
                id: id,
                spotifyId: spotifyId,
                access_token: access_token
            };

            console.log(`Saved user id: ${req.session.userData.id}`);
            console.log(`Saved session id: ${req.session.id}`);
            console.log(`Saved user access token: ${req.session.userData.access_token}`)
            res.redirect(frontendAddress + '/select');
        });
});


// Authorize a user and get their ACCESS TOKEN
function getToken(code) {
    console.log('* Running getToken');
    var reqOptions = {
      //Request access token by trading authorization code
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://accounts.spotify.com/api/token",
      body:
        "grant_type=authorization_code&code=" + code +
        "&redirect_uri=" + encodeURIComponent(backendAddress + "/loggedin") +
        "&client_id=" + clientId +
        "&client_secret=" + clientSecret
    };
  
    const userInfoPromise = rp(reqOptions);
    return userInfoPromise;
  }

// Get a user's PROFILE INFO <-- appears to be unused: March 19th 7:30pm
function getUserInfo(accessToken) {
    console.log("* Running getUserInfo");
    console.log(`Access token: ${accessToken}`);
    var reqOptions = {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: "https://api.spotify.com/v1/me",
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken
      }
    };
  
    var regPromise = rp(reqOptions);
    return regPromise;
  } 
  

// Add a user to database
async function addUser(code) {
    console.log("* Running addUser");
    var tokenInfo = await getToken(code);
    tokenInfo = await JSON.parse(tokenInfo);
    var userInfo = await getUserInfo(tokenInfo.access_token);
    userInfo = await JSON.parse(userInfo);

    // If user is not in database yet, add them
    if (!await dbMethods.getUsers(userInfo.id)) {
        await dbMethods.makeNewUser(userInfo.display_name, userInfo.id, userInfo.uri, tokenInfo.access_token, tokenInfo.refresh_token);
    } else {
        await dbMethods.updateTokens(userInfo.id, tokenInfo.access_token, tokenInfo.refresh_token);
    }

    // Get database index id of user
    var id = await dbMethods.getUserId(userInfo.id);
    var ret = {
        id: id,
        spotifyId: userInfo.id,
        access_token: tokenInfo.access_token
    }
    return ret;
}

module.exports = router