const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fetch = require('node-fetch')
const jQuery = require('jquery')

//Express app
const app = express()

const CLIENT_ID = '3f46110caa954bc7bd21488a97b66759'
const CLIENT_SECRET = '37ca1672f841408e8f93292516be3322'
const REDIRECT_URI = 'https://boiling-basin-27768.herokuapp.com/callback';

//GENERATES Access token
//curl -X "POST" -H "Authorization: Basic M2Y0NjExMGNhYTk1NGJjN2JkMjE0ODhhOTdiNjY3NTk6MzdjYTE2NzJmODQxNDA4ZThmOTMyOTI1MTZiZTMzMjI=" -d grant_type=client_credentials https://accounts.spotify.com/api/token

//Access token 
//Request a track: 2dpaYNEQHiRxtZbfNsse99
//curl -H "Authorization: Bearer BQAnyB16-GdjO7xJKOoBy0pQ6G2mGHwdsxzorWQBUjy6Po3oCvuupEapak5bp7vKs5lkDJOtYspgDd7Amxc" https://api.spotify.com/v1/tracks/2dpaYNEQHiRxtZbfNsse99

//Sample song
// {
//   "album" : {
//     "album_type" : "single",
//     "artists" : [ {
//       "external_urls" : {
//         "spotify" : "https://open.spotify.com/artist/64KEffDW9EtZ1y2vBYgq8T"
//       },
//       "href" : "https://api.spotify.com/v1/artists/64KEffDW9EtZ1y2vBYgq8T",
//       "id" : "64KEffDW9EtZ1y2vBYgq8T",
//       "name" : "Marshmello",
//       "type" : "artist",
//       "uri" : "spotify:artist:64KEffDW9EtZ1y2vBYgq8T"
//     }, {
//       "external_urls" : {
//         "spotify" : "https://open.spotify.com/artist/7EQ0qTo7fWT7DPxmxtSYEc"
//       },
//       "href" : "https://api.spotify.com/v1/artists/7EQ0qTo7fWT7DPxmxtSYEc",
//       "id" : "7EQ0qTo7fWT7DPxmxtSYEc",
//       "name" : "Bastille",
//       "type" : "artist",
//       "uri" : "spotify:artist:7EQ0qTo7fWT7DPxmxtSYEc"
//     } ],
//     "available_markets" : [ "AD", "AE", "AR", "AT", "AU", "BE", "BG", "BH", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "DZ", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IL", "IS", "IT", "JO", "JP", "KW", "LB", "LI", "LT", "LU", "LV", "MA", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "OM", "PA", "PE", "PH", "PL", "PS", "PT", "PY", "QA", "RO", "SA", "SE", "SG", "SK", "SV", "TH", "TN", "TR", "TW", "US", "UY", "VN", "ZA"
// ],
//     "external_urls" : {
//       "spotify" : "https://open.spotify.com/album/78EicdHZr5XBWD7llEZ1Jh"
//     },
//     "href" : "https://api.spotify.com/v1/albums/78EicdHZr5XBWD7llEZ1Jh",
//     "id" : "78EicdHZr5XBWD7llEZ1Jh",
//     "images" : [ {
//       "height" : 640,
//       "url" : "https://i.scdn.co/image/13e7cea6399eaaf6cc7ead76e9582f8a9e37dbff",
//       "width" : 640
//     }, {
//       "height" : 300,
//       "url" : "https://i.scdn.co/image/600b9b6e68c7d63495d653d544a9bbbbe380f194",
//       "width" : 300
//     }, {
//       "height" : 64,
//       "url" : "https://i.scdn.co/image/12702ff263a6686503b26eafff2f3d11d814708a",
//       "width" : 64
//     } ],
//     "name" : "Happier",
//     "release_date" : "2018-08-17",
//     "release_date_precision" : "day",
//     "total_tracks" : 1,
//     "type" : "album",
//     "uri" : "spotify:album:78EicdHZr5XBWD7llEZ1Jh"
//   },
//   "artists" : [ {
//     "external_urls" : {
//       "spotify" : "https://open.spotify.com/artist/64KEffDW9EtZ1y2vBYgq8T"
//     },
//     "href" : "https://api.spotify.com/v1/artists/64KEffDW9EtZ1y2vBYgq8T",
//     "id" : "64KEffDW9EtZ1y2vBYgq8T",
//     "name" : "Marshmello",
//     "type" : "artist",
//     "uri" : "spotify:artist:64KEffDW9EtZ1y2vBYgq8T"
//   }, {
//     "external_urls" : {
//       "spotify" : "https://open.spotify.com/artist/7EQ0qTo7fWT7DPxmxtSYEc"
//     },
//     "href" : "https://api.spotify.com/v1/artists/7EQ0qTo7fWT7DPxmxtSYEc",
//     "id" : "7EQ0qTo7fWT7DPxmxtSYEc",
//     "name" : "Bastille",
//     "type" : "artist",
//     "uri" : "spotify:artist:7EQ0qTo7fWT7DPxmxtSYEc"
//   } ],
//   "available_markets" : [ "AD", "AE", "AR", "AT", "AU", "BE", "BG", "BH", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "DZ", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IL", "IS", "IT", "JO", "JP", "KW", "LB", "LI", "LT", "LU", "LV", "MA", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "OM", "PA", "PE", "PH", "PL", "PS", "PT", "PY", "QA", "RO", "SA", "SE", "SG", "SK", "SV", "TH", "TN", "TR", "TW", "US", "UY", "VN", "ZA" ],
//   "disc_number" : 1,
//   "duration_ms" : 214289,
//   "explicit" : false,
//   "external_ids" : {
//     "isrc" : "USUG11801651"
//   },
//   "external_urls" : {
//     "spotify" : "https://open.spotify.com/track/2dpaYNEQHiRxtZbfNsse99"
//   },
//   "href" : "https://api.spotify.com/v1/tracks/2dpaYNEQHiRxtZbfNsse99",
//   "id" : "2dpaYNEQHiRxtZbfNsse99",
//   "is_local" : false,
//   "name" : "Happier",
//   "popularity" : 95,
//   "preview_url" : null,
//   "track_number" : 1,
//   "type" : "track",
//   "uri" : "spotify:track:2dpaYNEQHiRxtZbfNsse99"
// }

//Spotify API require
var SpotifyWebApi = require('spotify-web-api-node')

var spotifyApi = new SpotifyWebApi({
  clientId : CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri : REDIRECT_URI
})

let accessToken = 'BQAnyB16-GdjO7xJKOoBy0pQ6G2mGHwdsxzorWQBUjy6Po3oCvuupEapak5bp7vKs5lkDJOtYspgDd7Amxc';

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