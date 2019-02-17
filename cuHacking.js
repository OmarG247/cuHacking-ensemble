function makePlaylist(playlists) {
  let genres = {};
  let newPlaylist = [];
  // let numSongs = 0;

  // create map to count genre occurences
  for (let playlist of playlists) {
    for (let song of playlist) {
      if (genres[song.genre]) ++genres[song.genre];
      else genres[song.genre] = 1;
    }
  }

  // find most popular genre
  let mostPopular = -1;
  let popularGenre;
  for (let genre of Object.keys(genres)) {
    if (genres[genre] > mostPopular) {
      mostPopular = genres[genre];
      popularGenre = genre;
    }
  }

  // add songs with popular playlist to new playlist
  for (let playlist in playlists) {
    for (let song in playlist)
      if (song.genre == popularGenre) newPlaylist.push(song);
  } 
}


const createPlaylist = (playlists) => {
  let genres = {};

  // create genres that are lists of songs
  for (let playlist of playlists) {
    for (let song of playlist) {
      if (!genres[song.genre]) genres[song.genre] = [];
      genres[song.genre].push(song);
    }
  }

  // find most popular genre (genre with longest array is most popular)
  let mostPopular = -1;
  let popularGenre;
  for (let genre in genres) {
    if (genres[genre].length > mostPopular)
      popularGenre = genre;
  }
  
  return genres[popularGenre];
};

module.exports = {
  createPlaylist : createPlaylist
};
// makePlaylist(playlists);
// createPlaylist(playlists);