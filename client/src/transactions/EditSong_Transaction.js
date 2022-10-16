import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, id, oldSong, newSong) {
        super();
        this.store = initStore;
        this.songId = id
        this.oldSong = oldSong
        this.newSong = newSong
    }

    doTransaction() {
        this.store.editSong(this.newSong)
    }
    
    undoTransaction() {
        this.store.undoEditSong(this.songId, this.oldSong);
    }
}