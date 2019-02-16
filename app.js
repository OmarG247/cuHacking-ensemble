const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fetch = require('node-fetch')

//Spotify API require
const SpotifyWebApi = require('spotify-web-api-node');

const CLIENT_ID = '3f46110caa954bc7bd21488a97b66759'
const CLIENT_SECRET = '37ca1672f841408e8f93292516be3322'
const REDIRECT_URI = 'http://localhost:3000/callback';

//Set up spotify API
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//let playlists = []

/**
 * Get list of playlists
 */

var spotifyApi = new SpotifyWebApi();
spotifyApi.setClientId(CLIENT_ID);
spotifyApi.setClientSecret(CLIENT_SECRET);


spotifyApi.clientCredentialsGrant()
  .then((data) => {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong!', err);
  });


spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function (data) {
    console.log('Artist albums', data.body);
  },
  function (err) {
    console.error(err);
  }
);

spotifyApi.getPlaylist('music1')
  .then((data) => {
    console.log('Some information about this playlist', data.body);
  }, function (err) {
    console.log('Something went wrong!', err);
  });

// (parseMusic = (data) => {
//   spotifyApi.getUserPlaylists('dc0gj9dfmo6tofbdkkx8ah09k')
//     .then(function (data) {
//       console.log('Retrieved playlists', data.body);
//     }, function (err) {
//       console.log('Something went wrong!', err);
//     });
// })();

app.get('/getdata', (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=http://${req.hostname}/playlists.html&scope=playlist-read-private`)
})
app.get('/playlists', (_, res) => res.send(playlists))

/**
 * Add playlists to global 
 */
app.post('/playlists', (req, res) => {
  playlists = [...playlists, req.data]
  return res.send({
    ok: true
  })
})

module.exports = app