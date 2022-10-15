import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'

const DeleteSongModal = () => {
  const { store } = useContext(GlobalStoreContext);
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")

  const index = store.songMarkedForDeletion

  function handleDeleteSong(event) {
      store.deleteSong();
  }
  function handleCloseModal(event) {
      store.hideDeleteSongModal();
  }

  useEffect(() => {
    if (index) {
        const song = store.currentList.songs[index]
        setTitle(song.title)
        setArtist(song.artist)
    }
  }, [index])

  return (
      <div
          className="modal"
          id="delete-song-modal"
          data-animation="slideInOutLeft">
          <div className="modal-dialog">
              <div className="dialog-header">
                  Delete {title} by {artist}?
              </div>
              <div id="confirm-cancel-container">
                  <button
                      id="confirm-button"
                      className="modal-button"
                      onClick={handleDeleteSong}
                  >
                    Confirm
                  </button>
                  <button
                      id="cancel-button"
                      className="modal-button"
                      onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
              </div>
          </div>
      </div>
  );
}

export default DeleteSongModal