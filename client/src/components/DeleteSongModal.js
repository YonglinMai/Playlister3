import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal(){
    const { store } = useContext(GlobalStoreContext);

    const index = store.songMarkedForDeletion;
    
    if (!store.currentList){
        return null;
    }

    const song = store.currentList.songs[index];

    function handleConfirmDeleteSong () {
        store.deleteSongTransaction(index);
        store.closeModal("delete-song-modal");
    }

    function handleCancelDeleteSongModal () {
        store.closeModal("delete-song-modal");
    }

  

        return (
            <div
                id="delete-song-modal"
                className={"modal "}
                data-animation="slideInOutLeft">
                <div
                    id='delete-song-root'
                    className="modal-root">
                    <div
                        id="delete-song-modal-header"
                        className="modal-north">
                            Delete Song</div>
                    <div
                        id="delete-song-modal-content"
                        className="modal-center"> Are you sure you wish to permanently delete {song !== undefined? song.title: ""} from the playlist?
                    </div>
                    <div className="modal-south">
                        <input type="button" id="edit-song-confirm-button" className="modal-button" value='Confirm' onClick={handleConfirmDeleteSong} />
                        <input type="button" id="edit-song-cancel-button" className="modal-button" value='Cancel' onClick={handleCancelDeleteSongModal} />
                    </div>
                </div>
            </div>
        );
}

export default DeleteSongModal