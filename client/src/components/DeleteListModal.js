import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

const DeleteListModal = () => {
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
            id="delete-list-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <div className="dialog-header">
                    Delete the {(store.listMarkedForDeletion != null) ? store.listMarkedForDeletion.name : ""} Playlist?
                </div>
                <div id="confirm-cancel-container">
                    <button
                        id="confirm-button"
                        className="modal-button"
                        onClick={handleDeleteList}
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

export default DeleteListModal;