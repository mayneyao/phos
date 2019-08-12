import React from 'react';
import './App.css';
import SongList from './components/SongList'
import Playlist from './components/Playlist'
import Notabase from 'notabase'
import BasePlayer from './components/BasePlayer'
import Settings from './components/Settings'

import { PhosPlayerContext } from "./components/PhosPlayerContext";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
  },
  contentWrapper: {
    display: 'flex',
    height: '100%'
  },
  playlist: {
    width: '25%',
    height: '100%',
    // maxWidth: 400,
    // backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  },
  playlistContent: {
    width: '75%',
    height: '100%',
    // maxWidth: 1200,
    // backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  },
}));


function PhosPlayer() {
  const { state, dispatch } = React.useContext(PhosPlayerContext)

  React.useEffect(() => {
    let nb = new Notabase()
    const fetchData = async () => {
      console.log("fetchData")
      let phosConfigURL = localStorage.getItem("phosConfigURL")
      if (phosConfigURL) {
        let config = await nb._fetch(phosConfigURL)
        let db = await nb.fetch({
          songs: config.rows.find(i => i.name === "songs").url,
          albums: config.rows.find(i => i.name === "albums").url,
          artists: config.rows.find(i => i.name === "artists").url,
        })

        dispatch({
          type: 'loadData',
          payload: {
            data: db
          }
        })
      } else {
        dispatch({
          type: 'setPlayerConfig',
          payload: {
            name: 'openSettings',
            value: true
          }
        })
      }
    }
    fetchData()
  }, [])

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.contentWrapper}>
        <div className={classes.playlist}>
          <Playlist />
        </div>
        <div className={classes.playlistContent}>
          <SongList />
        </div>
      </div>

      <BasePlayer />
      <Settings />
    </div>
  );
}

export default PhosPlayer;