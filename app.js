const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const fetch = require('node-fetch')
const matcher = require('./public/javascripts/generate.js');
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

var scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-collaborative']
var state = 'LOGIN';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: REDIRECT_URI,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
});

// // Create the authorization URL
// var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// console.log(authorizeURL);

// app.get('/callback', (req, res) => {
//   console.log("we here");
//   console.log(req.body);
// })

//http://localhost:3000/callback?code=AQB9IGpZkys7b0_ZRNAqRd4ADiIcGLFQXwpIsb9MRaEv_E_y_eBOszLe9Afp1TKyv628s6XTTwhio8EJRrZhGfqulvApgdtFJ9m3nCdnN_cK4-M-NpA0taM5vMOv-aTdE4Odc7T_wzhtOJDq907di3DlUe7Uv04FXoeEEBob2OhICpKjE9eYuUxyadcPT8oRzwn6h-bHdsQu8ex5QHiSsXbrdsgbM1ElzVpTWlfhG8Uj-Hkq_svojLdwGZFV--ZM5mOhfIsfGyIlcM4QTPKEW8ilCrC0IUzkwbx5JeGskL9cxCMxsazUB2QzchExpmFfbinJulLG1b6r4QU&state=LOGIN

let accessCode = 'AQB9IGpZkys7b0_ZRNAqRd4ADiIcGLFQXwpIsb9MRaEv_E_y_eBOszLe9Afp1TKyv628s6XTTwhio8EJRrZhGfqulvApgdtFJ9m3nCdnN_cK4-M-NpA0taM5vMOv-aTdE4Odc7T_wzhtOJDq907di3DlUe7Uv04FXoeEEBob2OhICpKjE9eYuUxyadcPT8oRzwn6h-bHdsQu8ex5QHiSsXbrdsgbM1ElzVpTWlfhG8Uj-Hkq_svojLdwGZFV--ZM5mOhfIsfGyIlcM4QTPKEW8ilCrC0IUzkwbx5JeGskL9cxCMxsazUB2QzchExpmFfbinJulLG1b6r4QU'
let accessToken = 'BQApgt-C9STmi0aYpFdZ4wRW04xl7ymdT0yiPQV6XjOU50Tf4fmM5rFpy80RlBXnc9qv4Dp0wy6kQ1Nec8I'

spotifyApi.setAccessToken(accessToken);

//Main array of playlists
let mainPlayLists = [];

//Main genres
let genres = [];

//Main Codes for artists
let codes = [];

//Main final playlist
let finalPlaylist = [];

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

const getArtistGenre = async (artists) => {
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

const create = (access, songs) => {

  console.log("adding...");

  spotifyApi
    .authorizationCodeGrant(access)
    .then((data) => {
      console.log(data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
      return spotifyApi.addTracksToPlaylist(
        '0wZRPN8mYpsTkNSUzNZXkN',
        songs, {
          position: 0
        }, (data) => {
          console.log(data);
        }
      );
    })
    .then((data) => {
      console.log('Added tracks to the playlist!');
    })
    .catch((err) => {
      console.log("The error is part 3")
      console.log('Something went wrong!', err.message);
    });
}

//Sample user
//https://open.spotify.com/user/dc0gj9dfmo6tofbdkkx8ah09k?si=RjI0KmhlSdeFw-QEg9KfpA
//Sample playlist
//https://open.spotify.com/user/dc0gj9dfmo6tofbdkkx8ah09k/playlist/1PBjEtPjjLvd9HClk9iJrF?si=kt9NTki2QtuboPaRYd4QkA

const spotifyUser = (user) => {
  spotifyApi.getUserPlaylists('dc0gj9dfmo6tofbdkkx8ah09k')
    .then((data) => {
      ////console.log('Retrieved playlists', data.body);

      let listSongs = data.body.items[0].tracks
      //console.log("These are the tracks of first playlist");
      //console.log(listSongs);

      let playlistLink = listSongs.href;

      //console.log("This is the link of playlist");
      //console.log(playlistLink);

      let playlistCode = "";

      playlistCode = getPlaylistCode(playlistLink);

      //console.log("This is the code: ");
      //console.log(playlistCode);

      spotifyApi.getPlaylist(playlistCode)
        .then((data) => {
          //console.log('Playlist data', data.body);

          let tracks = [];

          tracks = data.body.tracks.items;

          //          //console.log("Actual tracks:");
          //          //console.log(tracks);

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

const spotifyPlaylist = async (playlistLink) => {
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

      let actualPlaylist = matcher.createPlaylist(mainPlayLists);
      // let playlistIDs = [];
      // for (let i = 0; i < actualPlaylist.length; i++) {
      //   playlistIDs.push("spotify:track:" + actualPlaylist[i].track.id)
      // }
      // console.log(playlistIDs);

      finalPlaylist.push(actualPlaylist);

    }, (err) => {
      console.log('Error while getting playlist info', err);
    });
}

//spotifyPlaylist('https: //open.spotify.com/user/dc0gj9dfmo6tofbdkkx8ah09k/playlist/5pmn8JWKAH08yjPZ87DPoz?si=vNl65QkITWqAWSx7EnFMgQ');
//spotifyPlaylist(https://open.spotify.com/user/michael.rabbai/playlist/0gBRNNupxz2Km4uUSGLkys?si=zGO-HFDgTAOr_y0PYVoqYg);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.get('/music', (req, res) => {
  res.send(finalPlaylist);
})

app.post('/playlists', (req, res) => {
  console.log(req.body);

  var playListLink = req.body.link;

  console.log("Link requested: ", playListLink);

  spotifyPlaylist(playListLink).then(() => {
    console.log("data is being sent")
    res.send(finalPlaylist);
  })

})

app.use(express.static('public'));

app.listen(3000, () => {
  console.log("Server started on port 3000");
})

module.exports = app