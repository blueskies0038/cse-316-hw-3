import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store';

const EditSongModal = () => {
  const { store } = useContext(GlobalStoreContext);
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [youTubeId, setYouTubeId] = useState("")

  const index = store.songMarkedForEdit

  const handleEditSong = () => {
      const newSong = {
          title,
          artist,
          youTubeId,
      }
      store.addEditSongTransaction(newSong)
  }

  const handleTitleChange = (event) => {
    event.preventDefault()
    setTitle(event.target.value)
  }

  const handleArtistChange = (event) => {
    event.preventDefault()
    setArtist(event.target.value)
  }

  const handleYouTubeIdChange = (event) => {
    event.preventDefault()
    setYouTubeId(event.target.value)
  }

  const handleCloseModal = (event) => {
      store.hideEditSongModal()
  }

  function handleKeyDown(event) {
      if (event.code === "Enter") {
          handleEditSong()
      }
  }

  useEffect(() => {
    if (index != null) {
        const song = store.currentList.songs[index]
        setTitle(song.title)
        setArtist(song.artist)
        setYouTubeId(song.youTubeId)
    }
  }, [index])
  
  return (
      <div 
        className="modal" 
        id="edit-song-modal" 
        data-animation="slideInOutLeft">
          <div className="modal-dialog">
              <div className="dialog-header">
                  Edit Song
              </div>
              <div className="modal-center" id="edit-song-form" onKeyDown={handleKeyDown}>
                Title:<input type="text" id="card-text-input-title" onChange={handleTitleChange} value={title} />
                Artist:<input type="text" id="card-text-input-artist" onChange={handleArtistChange} value={artist} />
                You Tube Id:<input type="text" id="card-text-input-youtube-id" onChange={handleYouTubeIdChange} value={youTubeId} />
              </div>
              <div id="confirm-cancel-container">
                  <input type="button" 
                      id="edit-song-confirm-button" 
                      className="modal-button" 
                      onClick={handleEditSong}
                      value='Confirm' />
                  <input type="button" 
                      id="edit-song-cancel-button" 
                      className="modal-button" 
                      onClick={handleCloseModal}
                      value='Cancel' />
              </div>
          </div>
      </div>
  )
}

export default EditSongModal