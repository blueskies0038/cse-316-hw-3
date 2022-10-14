import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

const DeleteModal = () => {
    const { store } = useContext(GlobalStoreContext);
    
    function handleDeleteList(event) {
        store.deleteList();
    }
    function handleCloseModal(event) {
        store.hideDeleteListModal();
    }
    return (
        <div
            className="modal"
            id="delete-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <header className="dialog-header">
                    Delete the {(store.listMarkedForDeletion != null) ? store.listMarkedForDeletion.name : ""} Playlist?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteList}
                    >
                      Confirm
                    </button>
                    <button
                        id="dialog-no-button"
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

export default DeleteModal;