import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
    MARK_SONG_DELETION: "MARK_SONG_DELETION",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
let tps = new jsTPS();
// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        songMarkedForDeletion: null,
        listMarkedForDeletion: null,
        listnameMarked: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type);
        console.log(payload);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }
            case GlobalStoreActionType.MARK_SONG_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion : payload,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }

            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: payload.id,
                    listnameMarked: payload.name
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    songMarkedForDeletion: store.songMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.markSongForDeletion = function(index){
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_DELETION,
            payload:index
        });
    }

    store.markListForDeletion = function(id, name){
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload:{
                id:id,
                name:name
            }
        });
    }
    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            console.log(response)
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(response.data.playlist);
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
        tps = new jsTPS();
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
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    store.setIsListNameEditActive = function(){
        return store.listNameActive
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // add new list
    store.createNewList = function () {
        let list = {"name" : "Untitled"+ (store.idNamePairs.length+1), "songs" : []}
        async function asyncAddList(){
            let response = await api.postNewList(list)
            if(response.data.success){
                let playlist = response.data.playlist;
                store.setCurrentList(playlist._id);
                async function getListPairs(playlist) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
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
        asyncAddList();
    }

    // adding new song to a list
    store.addNewSong = function () {
        async function asyncAddSong(){
            let response = await api.getPlaylistById(store.currentList._id);
            if(response.data.success){
                let playlist = response.data.playlist;
                playlist.songs.push({"title": "Untitled", "artist": "Unknown", "youTubeId": "dQw4w9WgXcQ"})
                async function updateList(playlist){
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    console.log(response.data.playlist)
                    if (response.data.success){
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: response.data.playlist
                        });
                    }
                }
                updateList(playlist);
            }
        }
        asyncAddSong();
    }

    store.deleteList = function(id){
        console.log(id);
        async function asyncDeleteList(id){
            let response = await api.deleteList(id)
            if(response.data.success){
                async function updateStore(){
                    response = await api.getPlaylistPairs()
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                updateStore();

            }
        }
        asyncDeleteList(id);
    }

    store.deleteSong = function(id){
        async function asyncDeleteSong(id){
            let response = await api.getPlaylistById(store.currentList._id);
            if(response.data.success){
                let playlist = response.data.playlist;
                playlist.songs.splice(id, 1);
                async function updateList(playlist){
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    console.log(response.data.playlist)
                    if (response.data.success){
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: response.data.playlist
                        });
                    }
                }
                updateList(playlist);
            }
        }
        asyncDeleteSong(id);
    }

    store.moveSong = function(start, end){
        async function asyncMoveSong(start, end){
            let response = await api.getPlaylistById(store.currentList._id);
            if(response.data.success){
                const list = response.data.playlist;
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
                //[playlist.songs[initId], playlist.songs[finalId]] = [playlist.songs[finalId], playlist.songs[initId]]
                async function updateList(list){
                    response = await api.updatePlaylistById(list._id, list);
                    if (response.data.success){
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: response.data.playlist
                        });
                    }
                }
                updateList(list);
            }
        }
        asyncMoveSong(start, end);
    }
    store.editSong = function(index, newSong){
        async function asyncEditSong(index, newSong){
            let response = await api.getPlaylistById(store.currentList._id);
            console.log(response)
            if(response.data.success){
                const playlist = response.data.playlist;
                playlist.songs[index] = newSong;
                async function updatePlaylistById(playlist){
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success){
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: response.data.playlist
                        });
                    }
                }
                updatePlaylistById(playlist)
            }
        }
        asyncEditSong(index, newSong);
    }

    let songEdited = ""
    store.editSongTransaction = function(id, newSong){
        let edit_Transaction = new jsTPS();

        edit_Transaction.doTransaction = function(){
            songEdited = store.currentList.songs[id];
            store.editSong(id, newSong);
        }

        edit_Transaction.undoTransaction = function(){
            store.editSong(id, songEdited);
        }
        //let transaction = new MoveSong_Transaction(initId,finalId)
        tps.addTransaction(edit_Transaction);
    }

    store.moveSongTransaction = function( initId, finalId){
        let moveSong_Transaction = new jsTPS();

        moveSong_Transaction.doTransaction = function(){
            store.moveSong(initId, finalId)
        }

        moveSong_Transaction.undoTransaction = function(){
            store.moveSong(finalId, initId)
        }
        //let transaction = new MoveSong_Transaction(initId,finalId)
        tps.addTransaction(moveSong_Transaction);
    }

    store.addSongTransaction = function(){
        let add_Transaction = new jsTPS();

        add_Transaction.doTransaction = function(){
            store.addNewSong();
        }

        add_Transaction.undoTransaction = function(){
            store.deleteSong(store.currentList.songs.length);
        }
        //let transaction = new MoveSong_Transaction(initId,finalId)
        tps.addTransaction(add_Transaction);
    }

    let songDeleted = null;

    store.deleteSongTransaction = function(id){
        let delete_Transaction = new jsTPS();
        delete_Transaction.doTransaction = function(){
            songDeleted = store.currentList.songs[id];
            store.deleteSong(id);
        }

        delete_Transaction.undoTransaction = function(){
            console.log(songDeleted)
            async function asyncinsertSong(id){
                let response = await api.getPlaylistById(store.currentList._id);
                if (response.data.success){
                    let playlist = response.data.playlist;
                    playlist.songs.splice(id,0,songDeleted);
                    async function updatePlaylistById(playlist){
                        response = await api.updatePlaylistById(playlist._id, playlist);
                        if(response.data.success){
                            storeReducer({
                                type: GlobalStoreActionType.SET_CURRENT_LIST,
                                payload: response.data.playlist
                            })
                        }
                    }
                    updatePlaylistById(playlist);
                }
            }
            asyncinsertSong(id);
        }
        //let transaction = new MoveSong_Transaction(initId,finalId)
        tps.addTransaction(delete_Transaction);
    }

    let modalOn = false;
    store.showModal = function(modalId){
            let modal = document.getElementById(modalId);
            modal.classList.add("is-visible");
            modalOn = true;
    }

    store.closeModal = function(modalId){
        let modal = document.getElementById(modalId);
        modal.classList.remove("is-visible");
        modalOn = false;
    }
    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}