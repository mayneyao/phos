import React from 'react';
import './App.css';
import SongList from './components/SongList'
import Playlist from './components/Playlist'
import Notabase from 'notabase'
import BasePlayer from './components/BasePlayer'
import Settings from './components/Settings'
import Hidden from '@material-ui/core/Hidden';
import SettingsIcon from '@material-ui/icons/Settings';
import LinearProgress from '@material-ui/core/LinearProgress';


import { PhosPlayerContext } from "./components/PhosPlayerContext";
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


const theme = createMuiTheme({
  palette: {
    primary: { main: '#38d4c9' }, // phos color
  },
});


const useStyles = makeStyles(theme => ({
  root: {
  },
  contentWrapper: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
    height: '100%'
  },
  playlist: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '25%',
    },
    height: '100%',
    // maxWidth: 400,
    // backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  },
  playlistContent: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '75%',
    },
    height: '100%',
    // maxWidth: 1200,
    // backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  },
  setting: {
    position: 'absolute',
    top: 6,
    right: 6,
    color: '#aaa'
  },
  listTitleWrapper: {
    width: '100%',
    textAlign: 'center'
  }
}));


function PhosPlayer() {
  const { state, dispatch } = React.useContext(PhosPlayerContext)

  const { loading } = state
  React.useEffect(() => {
    let nb = new Notabase()
    const fetchData = async () => {
      console.log("fetchData")
      let phosConfigURL = localStorage.getItem("phosConfigURL")
      if (phosConfigURL) {
        // console.log(phosConfigURL)
        let config = await nb._fetch(phosConfigURL)
        let db = await nb.fetch({
          songs: config.rows.find(i => i.name === "songs").url[0][1][0][1],
          albums: config.rows.find(i => i.name === "albums").url[0][1][0][1],
          artists: config.rows.find(i => i.name === "artists").url[0][1][0][1],
        })

        dispatch({
          type: 'loadData',
          payload: {
            data: db
          }
        })

        dispatch({ type: 'loading' })

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
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {
          loading && <LinearProgress />
        }
        <div className={classes.contentWrapper}>
          <div className={classes.playlist}>
            <div className={classes.listTitleWrapper}>
              <Playlist />
            </div>

            <Hidden smUp>
              <SettingsIcon aria-label="edit" className={classes.setting} onClick={
                () => {
                  dispatch({
                    type: 'setPlayerConfig',
                    payload: {
                      name: 'openSettings',
                      value: true
                    }
                  })
                }
              }>
                settings
              </SettingsIcon>
            </Hidden>
          </div>
          <div className={classes.playlistContent}>
            <SongList />
          </div>
        </div>

        <BasePlayer />
        <Settings />
      </div>
    </ThemeProvider>
  );
}

export default PhosPlayer;