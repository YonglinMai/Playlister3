import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import EditSongModal from './EditSongModal.js'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(event){
        event.stopPropagation();
        store.markSongForDeletion(index);
        store.showModal("delete-song-modal");
        // if(window.confirm("Are you sure you want to delete " + song.title + " ?")){
        //     store.deleteSongTransaction(index);
        // }
    }

    function handleDragStart(event){
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event){
        event.preventDefault();
    }

    function handleDragEnter(event){
        event.preventDefault();
    }
    function handleDrop(event){
        event.preventDefault();

        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));

        store.moveSongTransaction(sourceIndex, targetIndex)
    }

    function handleClick(event){
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            console.log(event.detail);
            store.markSongForDeletion(index);
            document.getElementById('edit-song-modal-title-textfield').value = song.title;
            document.getElementById('edit-song-modal-artist-textfield').value = song.artist;
            document.getElementById('edit-song-modal-youTubeId-textfield').value = song.youTubeId;
            store.showModal("edit-song-modal");
            
        }
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragEnter}
            onDrop={handleDrop}
            onClick={handleClick}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick = {handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;