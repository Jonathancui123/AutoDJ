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
const queueMethods = require('./queueMethods');
const dbMethods = require('./dbMethods');
const config = require('./config/keys');
const authRouter = require('./routes/api/spotifyAuth.js')

// DONT FORGET TO SET CLIENT SECRET IN ENV --> USE CMD (NOT POWERSHELL) AS ADMIN

// Environment vars
const PORT = process.env.PORT || 3000;

// Config -- import these variables to modules
const clientSecret = config.clientSecret;
const clientId = config.clientId;
const frontendAddress = config.frontendAddress;
const backendAddress = config.backendAddress;

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
// ROUTES
///////////////////////////////////////////////
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

// Handles all routes for spotify authentication
app.use(authRouter);

// Get user's info (name, spotifyId, parties)
app.get('/getUserInfo', (req, res) => {
	console.log('* /getUserInfo called');
	console.log(req.session);
	console.log("session id: ", req.session.id)
	// console.log(`Returned session id: ${req.session.id}`);
	try {
		dbMethods.getUserInfo(req.session.userData.id)
			.then((info) => {
				res.send(info);
			})
			.catch((err) => console.log('Could not get user info, ' + err));
	}
	catch (err) {
		console.log(err.message);
	}
});

// Get party's info
app.get('/getPartyInfo/:playlistId', async (req, res) => {
	console.log(`* /getPartyInfo/${req.params.playlistId} called`);
	const playlistId = req.params.playlistId;
	const partyInfo = await dbMethods.getPartyInfo(playlistId);
	console.log("Party info: ", partyInfo);
	res.send(partyInfo);
});

// Check if current user is the host of the party - Is it req.params or req.query?
app.get('/isPartyHost/:playlistId', async (req, res) => {
	console.log(`* /isPartyHost/${req.params.playlistId} called`);
	const playlistId = req.params.playlistId;
	const partyInfo = await dbMethods.getPartyInfo(playlistId);
	console.log("req session id: ", req.session.id)
	console.log("req.session.userdata.spotifyId: ", req.session.userData.spotifyId)
	console.log("partyInfo.host.spotifyId: ", partyInfo.host.spotifyId)

	var partyAndHostInfo = JSON.parse(JSON.stringify(partyInfo))
	partyAndHostInfo.isHost = ((req.session.userData.spotifyId == partyAndHostInfo.host.spotifyId) ? true : false);
	console.log("Returning partyAndHostInfo: ", partyAndHostInfo);
	res.send(partyAndHostInfo);
});

// Create new party/playlist
app.post('/newParty', async (req, res) => {
	console.log('* /newParty called');
	console.log("session id: ", req.session.id)

	const playlistName = req.body.playlistName;
	const genres = req.body.genres.split("/");
	const playlistDur = 60 * 1000 * parseInt(req.body.duration);
	const retrievedUserData = await dbMethods.getUserInfo(req.session.userData.id);
	const accessToken = retrievedUserData.accessToken;
	const userId = retrievedUserData.spotifyId;
	console.log('Variable declaration done');
	console.log(`Access token: ${accessToken}`);
	console.log(`Playlist name: ${playlistName}`);
	console.log(`User ID: ${userId}`);

	// Generate new playlist
	var tempBank = await queueMethods.getSongs(accessToken);
	tempBank = await queueMethods.addSongsToBank(tempBank, accessToken);
	console.log(tempBank.slice(0, 10));
	var createdPlaylist = await queueMethods.createNewPlaylist(accessToken, playlistName, userId);
	const playlistId = JSON.parse(createdPlaylist).id;
	console.log(`Playlist ID: ${playlistId}`);
	var genreOnlyBank = queueMethods.createGenredBank(genres, tempBank);
	var shortListURI = queueMethods.genShortListURI(genreOnlyBank, playlistDur);
	console.log('Playlist generated');

	// Make new party & host object
	const host = await dbMethods.makeNewPartyUser(userId, 'host');
	const partyId = await dbMethods.makeNewParty(host, playlistName, playlistId);
	console.log('Party created');

	// Add party to current user's profile
	await dbMethods.addParty(req.session.userData.id, playlistId);

	try {
		await queueMethods.addSongsToPlaylist(accessToken, shortListURI, playlistId);
		res.send({
			status: "success",
			playlistId: playlistId
		});
	} catch {
		console.log('Could not add songs to playlist');
		res.send({
			status: "fail"
		});
	}
});

// Join a party
app.post('/joinParty/:playlistId', async (req, res) => {
	console.log(`* /joinParty/${req.query.playlistId} called`);
	const partyMembers = await dbMethods.getPartyInfo(req.query.playlistId).members;
	partyMembers = partyMembers.map(member => member.spotifyId);
	if (!partyMembers.include(req.session.userData.spotifyId)) {
		await dbMethods.joinParty(req.session.userData.spotifyId, req.query.playlistId);
	}
});

// Check if person is logged in (return true if logged in)
app.get('/checkLogin', (req, res) => {
	console.log('* /checkLogin called');
	res.send(req.session.userData ? true : false);
});

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
