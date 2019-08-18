
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { PhosPlayerContext } from '../PhosPlayerContext'
import PhosSlider from './PhosSlider'
import PhosCacheSlider from './PhosCacheSlider'
import Hidden from '@material-ui/core/Hidden';


const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
    },
    process: {
        maxWidth: 800,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
        margin: '0 10px',
        position: 'relative'

    },
    second: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 20
    },
    time: {
        display: 'block',
        width: '10%',
        padding: 3
    },
    timeLeft: {
        textAlign: 'end'
    }
}))

const seconds2Minutes = (time) => {
    let minutes = Math.floor(time / 60)
    let seconds = parseInt(time % 60)
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${(seconds + '').slice(0, 2)}`
}


export default function ProcessSlider(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { playingState: { playedSeconds, loadedSeconds }, currentPlaySong, isBufferEnd } = state
    const classes = useStyles()
    const { length } = currentPlaySong
    let len = length ? seconds2Minutes(length) : '00:00'

    return <div className={classes.card}>
        <Hidden smDown>
            <div className={`${classes.time} ${classes.timeLeft}`}>
                {playedSeconds ? seconds2Minutes(playedSeconds) : '00:00'}
            </div>
        </Hidden>
        <div className={classes.process}>
            <PhosCacheSlider
                valueLabelDisplay="off"
                aria-label="pretto slider"
                value={loadedSeconds || 0}
                max={parseInt(length || 100)}
                onChange={(e, v) => {
                    props.seekTo(v)
                }}
                style={{
                    position: 'absolute'
                }}
            />
            <PhosSlider
                valueLabelDisplay="off"
                aria-label="pretto slider"
                value={playedSeconds ? playedSeconds : 0}
                max={parseInt(length || 100)}
                onChange={(e, v) => {
                    props.seekTo(v)
                }}
                style={{
                    position: 'absolute'
                }}
            />
            <Hidden smUp>
                <div className={classes.second}>
                    <div>
                        {playedSeconds ? seconds2Minutes(playedSeconds) : '00:00'}
                    </div>
                    <div>
                        {len}
                    </div>
                </div>
            </Hidden>
        </div>
        <Hidden smDown>
            <div className={classes.time}>
                {len}
            </div>
        </Hidden>
    </div>
}