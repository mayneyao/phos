import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
import { PhosPlayerContext } from '../PhosPlayerContext'

import PhosSlider from './PhosSlider'

const useStyles = makeStyles({
  root: {
    width: 150,
    height: 40
  },
});

export default function InputSlider() {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(PhosPlayerContext)
  const { volume } = state
  const handleSliderChange = (event, newValue) => {
    dispatch({
      type: 'setVolume',
      payload: {
        volume: newValue
      }
    })
  }

  const muteOrOpen = () => {
    if (volume !== 0) {
      dispatch({
        type: 'setVolume',
        payload: {
          volume: 0
        }
      })
    } else {
      dispatch({
        type: 'setVolume',
        payload: {
          volume: 1
        }
      })
    }
  }
  const isMute = volume === 0

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {
            isMute ? <VolumeOff onClick={muteOrOpen} /> : <VolumeUp onClick={muteOrOpen} />
          }
        </Grid>
        <Grid item xs>
          <PhosSlider
            value={typeof volume === 'number' ? volume : 0}
            onChange={handleSliderChange}
            max={1}
            step={0.01}
            aria-labelledby="input-slider"
          />
        </Grid>
      </Grid>
    </div>
  );
}
