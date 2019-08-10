import React, { useState, useReducer } from 'react';

const PhosPlayerContext = React.createContext();

const NOTION_BASE = "https://notion.so"

const initState = {
    data: {}, // 音乐数据 
    currentPlaySong: {}, // 当前播放的音乐
    currentPlaylist: [], // 不会被存储的当前播放列表

    url: '', // 
    volume: 1, // 0-1 音量 
    muted: false, // 
    playing: false, // 是否播放
    isReady: false, // 当前歌曲是否加载完毕，可以播放
}


// reducer

function phosReducer(state, action) {
    switch (action.type) {

        case 'loadData':
            return {
                ...state,
                data: action.payload.data
            }
        case 'play':
            return {
                ...state,
                playing: !state.playing
            }

        case 'playOneSong':
            return {
                ...state,
                currentPlaySong: action.payload.song,
                url: `${NOTION_BASE}/signed/${encodeURIComponent(action.payload.song.file[0]).replace("s3.us-west", "s3-us-west")}`,
                isReady: false,
                playing: true
            }
        case 'changeVolume':
            return {
                ...state,
                volume: action.payload.volume
            }
    }
}


const PhosPlayerProvider = (props) => {
    const [state, dispatch] = useReducer(phosReducer, initState);

    return (
        <PhosPlayerContext.Provider value={{ state, dispatch }}>
            {props.children}
        </PhosPlayerContext.Provider>
    );
}

export { PhosPlayerContext, PhosPlayerProvider };