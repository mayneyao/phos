import React from 'react';
import ReactPlayer from 'react-player'
import { PhosPlayerContext } from "./PhosPlayerContext";

export default function Player() {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { playing, url } = state
    return <><ReactPlayer
        url={url}
        playing={playing}
        style={{ display: 'none' }}
    /></>
}