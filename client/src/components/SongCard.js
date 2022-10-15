import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const [isDragging, setIsDragging] = useState(false)

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    if (draggedTo) {
        cardClass = "-song-dragged-to";
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
        setIsDragging(true)
    }

    function handleDragOver(event) {
        event.preventDefault();
        setDraggedTo(true)
    }
    
    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true)
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false)
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        let index = target.id.indexOf("-")
        targetId = targetId.substring(index + 1, index + 2);
        let sourceId = event.dataTransfer.getData("song");
        index = sourceId.indexOf("-")
        sourceId = sourceId.substring(index + 1, index + 2);
        
        setIsDragging(false)
        setDraggedTo(false)

        store.addMoveSongTransaction(sourceId, targetId)
    }

    function handleClick(event) {
        if (event.detail === 2) {
          event.stopPropagation();
          store.markSongForEdit(index)
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
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}
                target="_blank" rel="noreferrer">
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;