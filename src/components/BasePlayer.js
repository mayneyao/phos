import React, { useState } from "react";
import ReactPlayer from "react-player";
import { PhosPlayerContext } from "./PhosPlayerContext";

import ControlCard from "./Control/ControlCard";
import { throttle } from "lodash";

export default function Player() {
  const { state, dispatch } = React.useContext(PhosPlayerContext);
  const player = React.useRef(null);
  const [hiddenPlayer, setHiddenPlayer] = useState(false);
  const { playing, url, volume, repeat } = state;
  const _onProgress = playingState => {
    if (!hiddenPlayer && playingState.played > 0) {
      // 开始播放隐藏播放器
      setHiddenPlayer(true);
    } else if (playingState.played === 0) {
      setHiddenPlayer(false);
    }
    dispatch({
      type: "updatePlayingState",
      payload: {
        playingState
      }
    });
  };
  const onProgress = throttle(_onProgress, 1000);

  const onEnded = () => {
    setHiddenPlayer(false);
    const {
      currentPlaySong,
      data: { history }
    } = state;
    try {
      if (!currentPlaySong.length) {
        currentPlaySong.length = player.current.getDuration();
        console.log(`已自动更新:${currentPlaySong.title} 歌曲时长`);
      }
    } catch (error) {
      console.log(`无法更新:${currentPlaySong.title} 歌曲时长`);
      console.log(error);
    }

    try {
      //
      history.addRow({
        song: [currentPlaySong]
      });
      console.log(`更新听歌记录成功`);
    } catch (error) {
      console.log(`更新听歌记录失败`);
    }

    dispatch({
      type: "next"
    });
  };
  const onBuffer = () => {
    dispatch({
      type: "setPlayerConfig",
      payload: {
        name: "isBufferEnd",
        value: false
      }
    });
  };

  const onBufferEnd = () => {
    dispatch({
      type: "setPlayerConfig",
      payload: {
        name: "isBufferEnd",
        value: true
      }
    });
  };

  const seekTo = seconds => {
    player.current.seekTo(seconds);
  };
  let showPlayer =
    url && url.startsWith("https://www.youtube.com") && !hiddenPlayer
      ? { display: "block" }
      : { display: "none" };
  return (
    <>
      <ReactPlayer
        ref={player}
        url={url}
        volume={volume}
        playing={playing}
        onProgress={onProgress}
        style={showPlayer}
        loop={repeat === "one"}
        progressInterval={0}
        onEnded={onEnded}
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        // progressInterval={0}
      />
      <ControlCard seekTo={seekTo} />
    </>
  );
}
