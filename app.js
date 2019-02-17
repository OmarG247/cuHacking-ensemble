const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const fetch = require('node-fetch')
const matcher = require('./public/javascripts/cuHacking');
const routeHandler = require('./public/javascripts/routes.js');
const bodyParser = require('body-parser')

//Express app
const app = express()

const CLIENT_ID = '3f46110caa954bc7bd21488a97b66759'
const CLIENT_SECRET = '37ca1672f841408e8f93292516be3322'
const REDIRECT_URI = 'http://localhost:3000/callback';

//GENERATES Access token
//curl -X "POST" -H "Authorization: Basic M2Y0NjExMGNhYTk1NGJjN2JkMjE0ODhhOTdiNjY3NTk6MzdjYTE2NzJmODQxNDA4ZThmOTMyOTI1MTZiZTMzMjI=" -d grant_type=client_credentials https://accounts.spotify.com/api/token

//Access token 
//Request a track: 2dpaYNEQHiRxtZbfNsse99
//curl -H "Authorization: Bearer BQAnyB16-GdjO7xJKOoBy0pQ6G2mGHwdsxzorWQBUjy6Po3oCvuupEapak5bp7vKs5lkDJOtYspgDd7Amxc" https://api.spotify.com/v1/tracks/2dpaYNEQHiRxtZbfNsse99

//curl -H "Authorization: Bearer BQAnyB16-GdjO7xJKOoBy0pQ6G2mGHwdsxzorWQBUjy6Po3oCvuupEapak5bp7vKs5lkDJOtYspgDd7Amxc" https://api.spotify.com/v1/artists/64KEffDW9EtZ1y2vBYgq8T

//Spotify API require
var SpotifyWebApi = require('spotify-web-api-node')

var spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
})

let accessToken = 'BQB_l7Z5B27HgNjLd2AiKKmICHRoi3dDbtC2rFQOJ3V6d1CXyML3rz6m5aIwi87640UU_L8pw2zneBAdO-k';

spotifyApi.setAccessToken(accessToken);

//Main array of playlists
let mainPlayLists = [];

//Main genres
let genres = [];

//Main Codes for artists
let codes = [];

const getSongCode = (link) => {
  let counter = 0;
  let result = "";

  for (let i = 0; i < link.length; i++) {
    if (link[i] === '/') counter++;
    if (link[i] === '?') break;
    if (counter === 7) result += link[i];
    if (counter === 6) counter++;
  }

  return result;
}

const getPlaylistCode = (link) => {
  let counter = 0;
  let result = "";

  for (let i = 0; i < link.length; i++) {
    if (link[i] === '/') counter++;
    if (link[i] === '?') break;
    if (counter === 7) result += link[i];
    if (counter === 6) counter++;
  }

  return result;
}

const getArtistCode = (link) => {
  let counter = 0;
  let result = "";

  for (let i = 0; i < link.length; i++) {
    if (link[i] === '/') counter++;
    if (counter === 5) result += link[i];
    if (counter === 4) counter++;
  }

  return result;
}

const getArtistGenre = async (artists) =>
{
  return await spotifyApi.getArtist(artists[i])
    .then((data) => {
      getArtistGenre(artists)
      genres.push(data.body.genres);
    }, (err) => {
      console.error(err);
    });
};

const getArtistGenres = async (artists) => {

  return await spotifyApi.getArtist(artists[i])
    .then((data) => {
      genres.push(data.body.genres);
    }, (err) => {
      console.error(err);
    });
}

//Sample user 
//https://open.spotify.com/user/dc0gj9dfmo6tofbdkkx8ah09k?si=RjI0KmhlSdeFw-QEg9KfpA
//Sample playlist 
//https://open.spotify.com/user/dc0gj9dfmo6tofbdkkx8ah09k/playlist/1PBjEtPjjLvd9HClk9iJrF?si=kt9NTki2QtuboPaRYd4QkA

const spotifyUser = (user) => {
  spotifyApi.getUserPlaylists('dc0gj9dfmo6tofbdkkx8ah09k')
    .then((data) => {
      //console.log('Retrieved playlists', data.body);

      let listSongs = data.body.items[0].tracks
      console.log("These are the tracks of first playlist");
      console.log(listSongs);

      let playlistLink = listSongs.href;

      console.log("This is the link of playlist");
      console.log(playlistLink);

      let playlistCode = "";

      playlistCode = getPlaylistCode(playlistLink);

      console.log("This is the code: ");
      console.log(playlistCode);

      spotifyApi.getPlaylist(playlistCode)
        .then((data) => {
          console.log('Playlist data', data.body);

          let tracks = [];

          tracks = data.body.tracks.items;

          console.log("Actual tracks:");
          console.log(tracks);

        }, (err) => {
          console.log('Error while getting playlist info', err);
        });

    }, (err) => {
      console.log('Error while getting user playlist', err);
    });
}

const addGenre = (songs) => {
  for (let i = 0; i < songs.length; i++) {
    if (i < 7) {
      songs[i].genre = "rock";
    } else {
      songs[i].genre = "pop";
    }
  }
  
}

const spotifyPlaylist = (playlistLink) => {
  let playlistCode = getPlaylistCode(playlistLink);

  spotifyApi.getPlaylist(playlistCode)
    .then((data) => {
      console.log('Adding: ', data.body.name);

      let tracks = [];

      tracks = data.body.tracks.items;

      console.log("Actual tracks:");
      console.log(tracks.length);

      addGenre(tracks);

      mainPlayLists.push(tracks);

      // for (let i = 0; i < tracks.length; i++) {
      //   artistCode = getArtistCode(tracks[i].track.artists[0].external_urls.spotify);
      //   codes.push(artistCode);
      // }

      // console.log(codes);

      console.log("Playlist name: ", data.body.name)
      console.log(mainPlayLists);

      console.log(matcher.createPlaylist(mainPlayLists));

      return matcher.createPlaylist(mainPlayLists);

      console.log("Main playlist after adding a playlist")
      console.log("Main playlist has ", mainPlayLists.length, " playlists");

    }, (err) => {
      console.log('Error while getting playlist info', err);
    });
}

// spotifyPlaylist(`https://open.spotify.com/user/dc0gj9dfmo6tofbdkkx8ah09k/playlist/5pmn8JWKAH08yjPZ87DPoz?si=vNl65QkITWqAWSx7EnFMgQ`);
// spotifyPlaylist(`https://open.spotify.com/user/michael.rabbai/playlist/0gBRNNupxz2Km4uUSGLkys?si=zGO-HFDgTAOr_y0PYVoqYg`);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.post('/playlists', (req, res) => {
  console.log(req.body);

  var playListLink = req.body.link;

  console.log("Link requested: ", playListLink);

  spotifyPlaylist(playListLink);
})

app.use(express.static('public'));

app.listen(process.env.PORT || 80, () => {
  console.log("Server started on port 3000");
})



module.exports = app