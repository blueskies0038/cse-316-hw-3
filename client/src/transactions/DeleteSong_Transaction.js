import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, id, deletedSong) {
        super();
        this.store = initStore;
        this.songId = id;
        this.deletedSong = deletedSong
    }

    doTransaction() {
        this.store.deleteSong();
    }
    
    undoTransaction() {
        this.store.undoDeleteSong(this.songId, this.deletedSong)
    }
}