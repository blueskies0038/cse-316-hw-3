/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

router.post('/playlist', PlaylistController.createPlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)
router.post('/new-playlist/:counter', PlaylistController.createNewPlaylist)
router.delete('/playlist/:id', PlaylistController.deletePlaylist)
router.put('/playlist/:id', PlaylistController.updatePlaylist)
router.put('/playlist/:id/song', PlaylistController.addSong)
router.get('/playlist/:playlistId/song/:songIdx', PlaylistController.getSong)
router.put('/playlist/:playlistId/song/:songIdx', PlaylistController.updateSong)
router.delete('/playlist/:playlistId/song/:songIdx', PlaylistController.deleteSong)
router.post('/playlist/:playlistId/song/:songIdx/undo-delete', PlaylistController.undoDeleteSong)

module.exports = router