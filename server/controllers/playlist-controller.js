const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found'})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}
createNewPlaylist = (req, res) => {
  console.log(req.params.counter)
  const playlist = new Playlist({
      name: "Untitled " + req.params.counter,
      songs: [],
  });
  console.log("playlist: " + playlist);
  if (!playlist) {
      return res.status(400).json({ success: false, error: err })
  }

  playlist
      .save()
      .then(() => {
          return res.status(201).json({
              success: true,
              playlist: playlist,
              message: 'New Playlist Created!',
          })
      })
      .catch(error => {
          return res.status(400).json({
              error,
              message: 'New Playlist Not Created!',
          })
      })
}
deletePlaylist = async (req, res) => {
  await Playlist.remove({ _id: req.params.id }, (err, list) => {
      if (err) {
          return res.status(400).json({ success: false, error: err })
      }

      return res.status(200).json({ success: true, playlist: list })
  }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Updated Information must be provided',
        })
    }
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err, message: "Playlist not found"})
        }
        list.name = body.name
        list.songs = body.songs
        list
          .save()
          .then(() => {
              return res.status(201).json({
                  success: true,
                  playlist: list,
                  message: 'Playlist Updated!',
              })
          })
          .catch(error => {
              return res.status(400).json({
                  success: false,
                  error,
                  message: 'Playlist Not Updated!',
              })
          })
    })
}
addSong = async (req, res) => {
    const newSong = {
        title: "Untitled",
        artist: "Unknown",
        youTubeId: "dQw4w9WgXcQ"
    }
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err, message: "Playlist not found"})
        }
        const songs = list.songs
        songs.push(newSong)
        list.songs = songs
        list
          .save()
          .then(() => {
              return res.status(201).json({
                  success: true,
                  playlist: list,
                  message: 'Playlist Updated!',
              })
          })
          .catch(error => {
              return res.status(400).json({
                  success: false,
                  error,
                  message: 'Playlist Not Updated!',
              })
          })
    })
}
getSong = async (req, res) => {
    await Playlist.findOne({ _id: req.params.playlistId }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err, message: "Playlist not found"})
        }
        const song = list.songs[req.params.songIdx]
        if (!song) {
          return res.status(400).json({
              success: false,
              error,
              message: 'Song Not Found!',
          })
        }
        return res.status(201).json({
            success: true,
            song,
            message: 'Playlist Updated!',
        }) 
    })
}
updateSong = async (req, res) => {
    const newSong = req.body
    const index = req.params.songIdx
    await Playlist.findOne({ _id: req.params.playlistId }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err, message: "Playlist not found"})
        }
        const song = list.songs[index]
        if (!song) {
          return res.status(400).json({
              success: false,
              error,
              message: 'Song Not Found!',
          })
        }
        list.songs[index] = newSong
        list
          .save()
          .then(() => {
              return res.status(201).json({
                  success: true,
                  playlist: list,
                  song,
                  message: 'Song Updated!',
              })
          })
          .catch(error => {
              return res.status(400).json({
                  success: false,
                  error,
                  message: 'Song Not Updated!',
              })
          })
    })
}
deleteSong = async (req, res) => {
    const index = req.params.songIdx
    await Playlist.findOne({ _id: req.params.playlistId }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err, message: "Playlist not found"})
        }
        const songs = list.songs
        const deleteSong = songs[index]
        if (!deleteSong) {
          return res.status(400).json({
              success: false,
              error,
              message: 'Song Not Found!',
          })
        }
        songs.splice(index, 1)
        list.songs = songs
        list
          .save()
          .then(() => {
              return res.status(201).json({
                  success: true,
                  playlist: list,
                  song: deleteSong,
                  message: 'Song Deleted!',
              })
          })
          .catch(error => {
              return res.status(400).json({
                  success: false,
                  error,
                  message: 'Song Not Deleted!',
              })
          })
    })
}
undoDeleteSong = async (req, res) => {
    const deletedSong = req.body
    await Playlist.findOne({ _id: req.params.playlistId }, (err, list) => {
      if (err) {
          return res.status(400).json({ success: false, error: err, message: "Playlist not found"})
      }
      const songs = list.songs
      songs.splice(req.params.songIdx, 0, deletedSong)
      list.songs = songs
      list
          .save()
          .then(() => {
              return res.status(201).json({
                  success: true,
                  playlist: list,
                  message: 'Song Deletion Undone!',
              })
          })
          .catch(error => {
              return res.status(400).json({
                  success: false,
                  error,
                  message: 'Song Deletion not Undone!',
              })
          })
    })
}

module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    createNewPlaylist,
    deletePlaylist,
    updatePlaylist,
    addSong,
    getSong,
    updateSong,
    deleteSong,
    undoDeleteSong,
}