# AutoDJ

Helps make a playlist that ALL your friends can jam to by analyzing Spotify top tracks and generating a playlist that includes the people’s favorites

Current build: https://autodj-frontend.herokuapp.com/home

<img style="display: inline" src="https://i.imgur.com/I9egBvS.png" alt="AutoDJ Landing Page" width="45%"> <img style="display: inline" src="https://i.imgur.com/Nqp2dLB.png" alt="Playlist options for the host" width="45%">
<img style="display: inline" src="https://i.imgur.com/DKsDsln.png" alt="Host page to edit playlist and manage guests" width="45%">

## How it works

- A host creates a party and invites their guests to log in to AutoDJ with their Spotify accounts
- AutoDJ analyzes Spotify profiles for top tracks, and decides which songs will be most popular for the given crowd
- The host chooses any combination of music genres, a playlist duration, and AutoDJ saves the generated playlist directly to their Spotify library
- Following playlist creation, the host can manage guests in the AutoDJ party and change genres - creating a new playlist or updating the existing one

## How we built it

- React frontend performs routing and conditional rendering to give hosts unique features
- Node + Express backend performs secure OAuth authentication with the Spotify API to retrieve users tastes
- AsyncJS requests to the Spotify API queries tastes and identifies song genre
- Use mongoDB to store current active profiles and tastes so that users can load previous playlists and preferences in later logins
- Order playlists based on song rythm
- Use websockets to update the playlist for users in a party when a new user joins 


## Challenges
- Setting up sessions + OAuth 2.0 authorizations to ensure the user has a smooth experience when logging in
- We learned a lot about creating a truly asynchronous backend. Making numerous API calls to query data about several of songs and then synthesizing all of the information taught us more about using promises.
