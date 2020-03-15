// import { Router } from 'express';
// const rp = require("request-promise");
// const request = require("request");

// const clientId = "158a4f4cd2df4c9e8a8122ec6cc3863a";

// //Authorizing the app to get user data
// app.get("/login", (req, res) => {
//     var scopes =
//         "user-read-private user-read-email playlist-modify-public user-top-read";
//     console.log("login req received");
//     res.redirect(
//         "https://accounts.spotify.com/authorize" +
//         "?response_type=code" +
//         "&client_id=" +
//         clientId +
//         (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
//         "&redirect_uri=" +
//         encodeURIComponent(backendAddress + "/loggedin")
//     );
//     // frontEndAddress + "/create"
// });

// app.get("/loggedin", (req, res) => {
//     console.log("Client secret ", clientSecret);

//     var code = req.query.code;
//     console.log("code: ", code);
//     // console.log(code);



//     reqUserInfo(code, clientId, clientSecret)
//         .then(body => {
//             var parsed = JSON.parse(body);
//             if (users.length > 0) {
//                 guest_token = parsed.access_token;
//             } else {
//                 access_token = parsed.access_token;
//             }
//             refresh_token = parsed.refresh_token;
//             console.log("Access token reply: ", access_token);
//             console.log("refresh token: " + refresh_token);

//             /////////////////////////////////////
//             //Register the user into our database and get query their songs
//             /////////////////////////////////////
//             setInterval(refresh_access, 58 * 60000); // Refreshes token every 58 minutes, it expires every 60
//         })
//         .catch(err => {
//             console.log("Failed to req user info from Spotify: ", err.message);
//         });
//     // .then(() => console.log("Playlist ID: ", playlistID))
//     // res.sendFile(path.join(__dirname + '/views/loggedin.html'));
//     if (users.length > 0) {
//         res.redirect(frontendAddress + "/host")
//     } else {
//         res.redirect(frontendAddress + "/create");
//     }
// });

// function reqUserInfo(code, clientId, clientSecret) {
//     var reqOptions = {
//         //Request access token by trading authorization code 
//         method: "POST",
//         headers: { "content-type": "application/x-www-form-urlencoded" },
//         url: "https://accounts.spotify.com/api/token",
//         body:
//             "grant_type=authorization_code" +
//             "&code=" +
//             code +
//             "&redirect_uri=" +
//             encodeURIComponent(backendAddress + "/loggedin") +
//             "&client_id=" +
//             clientId +
//             "&client_secret=" +
//             clientSecret
//     };

//     const userInfoPromise = rp(reqOptions);
//     return userInfoPromise;
// }