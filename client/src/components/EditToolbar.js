import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS';
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const [canAddSong, setCanAddSong] = useState(false)
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [canClose, setCanClose] = useState(false)
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAddSong() {
        store.addAddSongTransaction()
    }
    useEffect(() => {
      setCanAddSong(store.getCanAddSong)
      setCanUndo(canAddSong && store.getCanUndo)
      setCanRedo(canAddSong && store.getCanRedo)
      setCanClose(store.getCanClose)
    }, [store, canAddSong])

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAddSong}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;