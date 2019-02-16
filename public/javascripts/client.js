// let musicData = {}
// let trackMatchList = {}

//const REDIRECT_URI = `http://${window.location.host}/callback`

//const authorize = () => fetch(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=playlist-read-private`)

// document
//   .getElementById("login")
//   .addEventListener("click", () => {
//     fetch(`http://${window.location.host}/getdata`)
//   })

// GET https://api.spotify.com/v1/users/{user_id}/playlists

(parseMusic = (data) => {
  spotifyApi.getUserPlaylists('dc0gj9dfmo6tofbdkkx8ah09k')
    .then(function (data) {
      console.log('Retrieved playlists', data.body);
    }, function (err) {
      console.log('Something went wrong!', err);
    });
})();

const getUsersPlaylists = (access) => {
  fetch('https://api.spotify.com/v1/users/me/playlists', {
    headers: {
      'Authorization': 'Bearer ' + access
    }
  }).then(x => x.json()).then(console.log)
}
