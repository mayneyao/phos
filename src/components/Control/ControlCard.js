import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

// icon
import SettingsIcon from '@material-ui/icons/Settings';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/Pause';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import SkipNextIcon from '@material-ui/icons/SkipNext';


import { parseImageUrl } from 'notabase/src/utils'
import VolumeCard from './VolumeCard'
import { PhosPlayerContext } from '../PhosPlayerContext'
import ProcessSlider from './ProcessSlider'
import { getSongArtists } from '../utils'

const shuffleArray = (arr) => {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
}

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    width: '100%'
  },
  playControls: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto'
  },
  songDetails: {
    display: 'flex',
    width: '25%',
  },
  cover: {
    minWidth: 100,
    height: '100%',
    maxWidth: 100,
  },
  content: {
    overflow: 'auto'
  },
  controlBtn: {
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  processSlider: {
    maxWidth: '100%',
  },
  volumeWrapper: {
    width: '25%',
  },
  volume: {
    position: 'absolute',
    top: 'calc(50% - 20px)',
    right: '5%',
  },
  active: {
    color: theme.palette.primary.main
  },
  settings: {
    position: 'absolute',
    bottom: 'calc(50% - 8px)',
    right: '10px',
    color: '#aaa'
  }
}));

export default function MediaControlCard(props) {
  const classes = useStyles()
  const theme = useTheme()
  const { state, dispatch } = React.useContext(PhosPlayerContext)
  const { playing, repeat, shuffle, currentPlaylist, currentPlaySong } = state
  let _currentPlaylist = currentPlaylist

  const getCover = () => {
    if (currentPlaySong && currentPlaySong.title && currentPlaySong.album && currentPlaySong.album[0] && (currentPlaySong.album[0].cover || currentPlaySong.album[0].cover_163)) {
      return parseImageUrl(currentPlaySong.album[0].cover[0] || currentPlaySong.album[0].cover_163, 80)
    } else {
      return 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Record-Album-02.jpg'
    }
  }
  return (
    <div>
      <Card className={classes.card}>
        <Hidden xsDown>
          <div className={classes.songDetails}>
            {
              currentPlaySong.title && <CardMedia
                className={classes.cover}
                image={getCover()}
                title={currentPlaySong.title}
              />
            }

            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5" noWrap>
                {currentPlaySong.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" noWrap>
                {currentPlaySong.title && getSongArtists(currentPlaySong)}
              </Typography>
            </CardContent>
          </div>
        </Hidden>
        <div className={classes.playControls}>
          <Hidden smUp>
            <div className={classes.processSlider}>
              <ProcessSlider seekTo={props.seekTo} />
            </div>
          </Hidden>
          <div className={classes.controlBtn}>
            <IconButton aria-label="shuffle" onClick={
              () => {
                dispatch({
                  type: 'setPlayerConfig',
                  payload: {
                    name: 'shuffle',
                    value: !shuffle
                  }
                })

                if (!shuffle) {
                  // 打乱当前播放列表
                  shuffleArray(_currentPlaylist)

                  dispatch({
                    type: 'setPlayerConfig',
                    payload: {
                      name: 'currentPlaylist',
                      value: _currentPlaylist
                    }
                  })
                }
              }
            }>
              <ShuffleIcon className={shuffle ? classes.active : ''} />
            </IconButton>

            <IconButton aria-label="previous" onClick={
              () => {
                dispatch({
                  type: 'prev'
                })
              }
            }>
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton aria-label="play/pause" onClick={() => dispatch({ type: 'play' })}>
              {
                playing ? <PauseIcon className={classes.playIcon} /> : <PlayIcon className={classes.playIcon} />
              }

            </IconButton>
            <IconButton aria-label="next" onClick={
              () => {
                dispatch({
                  type: 'next'
                })
              }
            }>
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
            <IconButton aria-label="loop" onClick={() => {
              dispatch({
                type: 'setRepeat'
              })
            }}>
              {
                repeat === 'one' ? <RepeatOneIcon className={classes.active} /> : <RepeatIcon className={repeat === 'list' ? classes.active : ''} />
              }
            </IconButton>
          </div>
          <Hidden xsDown>
            <div className={classes.processSlider}>
              <ProcessSlider seekTo={props.seekTo} />
            </div>
          </Hidden>
        </div>
        <Hidden xsDown>
          <div className={classes.volumeWrapper}>
            <div className={classes.volume}>
              <VolumeCard />
            </div>
            <div className={classes.settings}>
              <SettingsIcon aria-label="edit" className={classes.fab} onClick={
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
            </div>
          </div>
        </Hidden>
      </Card>
    </div>

  );
}
