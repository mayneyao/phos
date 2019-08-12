
import React from 'react'
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { PhosPlayerContext } from '../PhosPlayerContext'
import PhosSlider from './PhosSlider'

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
    },
    process: {
        maxWidth: 800,
        width: 800,
        margin: '0 10px'
    }
}))

const seconds2Minutes = (time) => {
    let minutes = Math.floor(time / 60)
    let seconds = parseInt(time % 60)
    if (seconds < 9) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${(seconds + '').slice(0, 2)}`
}


export default function ProcessSlider(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { playingState: { playedSeconds, loadedSeconds } } = state
    const classes = useStyles()

    return <div className={classes.card}>
        <span>
            {playedSeconds ? seconds2Minutes(playedSeconds) : '00:00'}
        </span>
        <div className={classes.process}>
            <PhosSlider
                valueLabelDisplay="off"
                aria-label="pretto slider"
                value={playedSeconds ? playedSeconds : 0}
                max={loadedSeconds ? loadedSeconds : 100}
                onChangeCommitted={(e, v) => {
                    props.seekTo(v)
                }}
            />
        </div>
        <span>
            {loadedSeconds ? seconds2Minutes(loadedSeconds) : '00:00'}
        </span>
    </div>
}