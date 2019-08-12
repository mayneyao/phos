import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


// icon
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/Pause';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import VolumeCard from './VolumeCard'
import { PhosPlayerContext } from '../PhosPlayerContext'

import ProcessSlider from './ProcessSlider'

const PhosColor = '#38d4c9'
const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  playControls: {
    maxWidth: '50%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: '0 auto'
  },
  controlBtn: {
    margin: '0 auto'
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  processSlider: {
    maxWidth: '100%',
  },
  volume: {
    position: 'absolute',
    top: 'calc(50% - 20px)',
    right: '5%'
  },
  active: {
    color: PhosColor
  }
}));

export default function MediaControlCard(props) {
  const classes = useStyles()
  const theme = useTheme()
  const { state, dispatch } = React.useContext(PhosPlayerContext)
  const { playing, repeat, shuffle } = state

  return (
    <div>
      <Card className={classes.card}>
        <div className={classes.songDetails}>

        </div>

        <div className={classes.playControls}>
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
          <div className={classes.processSlider}>
            <ProcessSlider seekTo={props.seekTo} />
          </div>
        </div>

        <div className={classes.volume}>
          <VolumeCard />
        </div>
      </Card>
    </div>

  );
}
