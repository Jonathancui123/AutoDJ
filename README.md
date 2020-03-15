# AutoDJ

Helps make a playlist that ALL your friends can jam to by analyzing Spotify top tracks and generating a playlist that includes the people’s favorites

Current build: http://autodj0.herokuapp.com/home

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

## Challenges

- We learned a lot about creating a truly asynchronous backend. Making numerous API calls to query data about several of songs and then synthesizing all of the information taught us more about using promises.

## Next Steps

- Use mongoDB to retain profiles and tastes so that users can load previous playlists and preferences in later logins
- Improve playlist customization options and provide the host with the option of changing genres
- Order playlists based on song rythm and pitch
- Use sockets to provide different parties with unique join links
