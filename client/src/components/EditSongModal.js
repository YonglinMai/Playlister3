import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal(){
    const { store } = useContext(GlobalStoreContext);
    let index = store.songMarkedForDeletion

    if (!store.currentList){
        return null;
    }

    let song = store.currentList.songs[index];

    let title = "";
    let artist = "";
    let youTubeId = "";

    if (song !== undefined){
        title = song.title;
        artist = song.artist;
        youTubeId = song.youTubeId;
    }

    function handleConfirmEditSong () {
        let newSongData = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        store.editSongTransaction(index, newSongData);
        store.closeModal("edit-song-modal");
    }

    function handleCancelEditSongModal () {store.closeModal("edit-song-modal");}

    function handleUpdateTitle (event) {title = event.target.value;}

    function handleUpdateArtist (event) {artist = event.target.value;}

    function handleUpdateYouTubeId (event) {youTubeId = event.target.value;}

        return (
            <div
                id="edit-song-modal"
                className={"modal "}
                data-animation="slideInOutLeft">
                <div
                    id='edit-song-root'
                    className="modal-root">
                    <div
                        id="edit-song-modal-header"
                        className="modal-north">Edit Song</div>
                    <div
                        id="edit-song-modal-content"
                        className="modal-center">
                        <div id="title-prompt" className="modal-prompt">Title:</div>
                        <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" defaultValue={song !== undefined? song.title: ""} onChange={handleUpdateTitle} />
                        <div id="artist-prompt" className="modal-prompt">Artist:</div>
                        <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" defaultValue={song !== undefined? song.artist: ""} onChange={handleUpdateArtist} />
                        <div id="you-tube-id-prompt" className="modal-prompt">YouTube Id:</div>
                        <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" defaultValue={song !== undefined? song.youTubeId: ""} onChange={handleUpdateYouTubeId} />
                    </div>
                    <div className="modal-south">
                        <input type="button" id="edit-song-confirm-button" className="modal-button" value='Confirm' onClick={handleConfirmEditSong} />
                        <input type="button" id="edit-song-cancel-button" className="modal-button" value='Cancel' onClick={handleCancelEditSongModal} />
                    </div>
                </div>
            </div>
        );
}

export default EditSongModal