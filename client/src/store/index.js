import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_LIST_FOR_DELETION: "SET_LIST_FOR_DELETION",
    DELETE_LIST: "DELETE_LIST",
    ADD_NEW_SONG: "ADD_NEW_SONG",
    SET_SONG_FOR_EDIT: "SET_SONG_FOR_EDIT",
    EDIT_SONG: "EDIT_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        songMarkedForEdit: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload,
                    currentList: store.currentList,
                    newListCounter: (store.newListCounter++),
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            case GlobalStoreActionType.SET_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload,
                    songMarkedForEdit: null
                })
            }
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                  idNamePairs: payload,
                  currentList: store.currentList,
                  newListCounter: store.newListCounter,
                  listNameActive: false,
                  listMarkedForDeletion: null,
                  songMarkedForEdit: null
                })
            }
            case GlobalStoreActionType.ADD_NEW_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null
                })
            }
            case GlobalStoreActionType.SET_SONG_FOR_EDIT: {
                return setStore({
                  idNamePairs: store.idNamePairs,
                  currentList: store.currentList,
                  newListCounter: store.newListCounter,
                  listNameActive: false,
                  listMarkedForDeletion: null,
                  songMarkedForEdit: payload
                })
            }
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                  idNamePairs: store.idNamePairs,
                  currentList: payload,
                  newListCounter: store.newListCounter,
                  listNameActive: false,
                  listMarkedForDeletion: null,
                  songMarkedForEdit: null
                })
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updateCurrentListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.createNewList = function () {
        async function asyncCreateNewList() {
            const counter = store.newListCounter
            let response = await api.createNewPlaylist(counter);
            if (response.data.success) {
                const playlist = response.data.playlist
                response = await api.getPlaylistPairs()
                if (response.data.success) {
                    let pairs = response.data.idNamePairs
                    storeReducer({
                      type: GlobalStoreActionType.CREATE_NEW_LIST,
                      payload: pairs
                  })
                }
                console.log(store.newListCounter)
                store.setCurrentList(playlist._id)
            }
        }
        asyncCreateNewList();
    }

    store.markListForDeletion = function (id) {
        async function asyncMark(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_LIST_FOR_DELETION,
                    payload: playlist
                });
                store.showDeleteListModal()
            }
        }
        asyncMark(id);
    }
    store.deleteList = function () {
        async function asyncDeleteList() {
            let response = await api.deletePlaylist(store.listMarkedForDeletion._id)
            if (response.data.success) {
                response = await api.getPlaylistPairs()
                if (response.data.success) {
                  const pairs = response.data.idNamePairs
                  storeReducer({
                      type: GlobalStoreActionType.DELETE_LIST,
                      payload: pairs
                  })
                }
            }
            store.hideDeleteListModal()
        }
        asyncDeleteList()
    }

    store.showDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }
    
    store.addNewSong = function () {
      async function asyncAddSong() {
          let response = await api.addNewSong(store.currentList._id)
          if (response.data.success) {
              const playlist = response.data.playlist
              storeReducer({
                  type: GlobalStoreActionType.ADD_NEW_SONG,
                  payload: playlist
              })
          }
      }
      asyncAddSong()
    }

    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.moveSong = function (start, end) {
        start = Number(start)
        end = Number(end)
        const list = store.currentList
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        store.currentList = list

        store.updateCurrentList()
    }

    store.markSongForEdit = function (index) {
        async function asyncMark(index) {
          console.log(index)
            let response = await api.getSongById(store.currentList._id, index);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_SONG_FOR_EDIT,
                    payload: index
                });
                store.showEditSongModal()
            }
        }
        asyncMark(index);
    }
    store.editSong = function (newSong) {
        async function asyncEditSong() {
            let response = await api.updateSongById(store.currentList._id, store.songMarkedForEdit, newSong)
            if (response.data.success) {
                const playlist = response.data.playlist
                storeReducer({
                    type: GlobalStoreActionType.EDIT_SONG,
                    payload: playlist
                })
            }
            store.hideEditSongModal()
        }
        asyncEditSong()
    }

    store.showEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}