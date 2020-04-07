// Third Party
const express = require('express');
const path = require('path');
const rp = require('request-promise');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Our modules
const dbMethods = require('./dbMethods');
const config = require('./config/keys');
const authRouter = require('./routes/api/spotifyAuth.js');
const partyRouter = require('./routes/api/partyManager.js');
const userRouter = require('./routes/api/userManager.js');

// DONT FORGET TO SET CLIENT SECRET IN ENV --> USE CMD (NOT POWERSHELL) AS ADMIN

// Environment vars
const PORT = process.env.PORT || 3000;
// Config -- import these variables to modules
const clientSecret = config.clientSecret;
const clientId = config.clientId;
const frontendAddress = config.frontendAddress;
const backendAddress = config.backendAddress;

// Use middleware
const app = express();
app.use(cors({
	origin: frontendAddress,
	credentials: true
})); // Allow CORS
app.use(bodyParser.json()); // Parse body from front end POST requests

const dbUrl = require('./config/keys.js').mongoURI;
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: "vagabond",
	cookie: { secure: false },
	store: new MongoStore({ url: dbUrl })
}));
app.use((req, res, next) => {
	res.set({
		'Access-Control-Allow-Origin': frontendAddress,
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
		'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
		'Access-Control-Allow-Credentials': true
	});
	next();
});

///////////////////////////////////////////////
// ROUTERS
///////////////////////////////////////////////
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

// Handles all routes for spotify authentication
app.use(authRouter);
app.use(partyRouter)
app.use(userRouter);


// Run this every 59 mins to refresh the access token for the user
function refresh_access() {
	console.log("refreshing access with refresh token: ", refreshToken);
	request.post(
		{
			headers: { "content-type": "application/x-www-form-urlencoded" },
			url: "https://accounts.spotify.com/api/token",
			body:
				"grant_type=refreshToken&refreshToken=" +
				refreshToken +
				"&client_id=" +
				clientId +
				"&client_secret=" +
				clientSecret
		},
		(err, httpResponse, body) => {
			if (err) {
				console.error(err);
			}
			parsed = JSON.parse(body);
			accessToken = parsed.accessToken;
			console.log("access refreshed. New access token: ", accessToken);
		}
	);
}

app.post("/test", (req, res) => {
	console.log("Recieved test post request", req.body);
	res.send("Thank you sir");
});

///////////////////////////////////////////////
// SONG/PLAYLIST FUNCTIONS
///////////////////////////////////////////////

function autoKick() { // TODO: REDESIGN - Does Spotify expiration kick 
	const now = new Date();
	var i = 0;
	while (users[i]) {
		if (now - users[i].joinTime > 60 * 60 * 1000) {
			users.splice(i, 1);
		} else {
			i++;
		}
	}
}

// Temporary function to reset server
app.get("/restartServer", (req, res) => {
	songBank = [];
	users = [];
	genres = [];
	playlistID = "0vvXsWCC9xrXsKd4FyS8kM"; //temp playlist
	nextUserId = 0;
	nextSongId = 0;

	//Host inputs:
	playlistDur = 20 * 60 * 1000; // Integer: time in ms
	playlistName = "";
	playlistURI = "";

	res.sendFile(path.join(__dirname + "/views/clear.html"));
});

app.listen(PORT, () => {
	console.log(`AutoDJ is running on port ${PORT}`);
});
