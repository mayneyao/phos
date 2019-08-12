import React, { useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player'
import { PhosPlayerContext } from "./PhosPlayerContext";

import ControlCard from './Control/ControlCard'

export default function Player() {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const player = React.useRef(null);
    const { playing, url, volume, repeat } = state
    const onProgress = (playingState) => {
        dispatch({
            type: 'updatePlayingState',
            payload: {
                playingState
            }
        })
    }

    const seekTo = (seconds) => {
        player.current.seekTo(seconds)
    }
    return <>
        <ReactPlayer
            ref={player}
            url={url}
            volume={volume}
            playing={playing}
            style={{ display: 'none' }}
            onProgress={onProgress}
            style={{ display: 'none' }}
            loop={repeat === 'one'}
        />
        <ControlCard seekTo={seekTo} />
    </>
}