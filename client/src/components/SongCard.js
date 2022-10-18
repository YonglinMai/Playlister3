import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(event){
        event.stopPropagation();
        if(window.confirm("Are you sure you want to delete " + song.title + " ?")){
            store.deleteSong(index);
        }
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

        store.moveSong(sourceIndex, targetIndex)
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