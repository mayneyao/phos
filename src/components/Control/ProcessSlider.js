
import React from 'react'
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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
        width: 800,
        margin: '0 10px',
        position: 'relative'

    },
    second: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 20
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
    const { playingState: { playedSeconds, loadedSeconds }, currentPlaySong, isBufferEnd } = state
    const classes = useStyles()
    const { length } = currentPlaySong
    let len = length ? seconds2Minutes(length) : '00:00'
    console.log(loadedSeconds)
    return <div className={classes.card}>
        <Hidden smDown>
            <span>
                {playedSeconds ? seconds2Minutes(playedSeconds) : '00:00'}
            </span>
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
                    <span>
                        {playedSeconds ? seconds2Minutes(playedSeconds) : '00:00'}
                    </span>

                    <span>
                        {currentPlaySong.title && `${currentPlaySong.title}-${currentPlaySong.artist && currentPlaySong.artist.map(a => a.name).join(",")}`}
                    </span>
                    <span>
                        {len}
                    </span>
                </div>
            </Hidden>
        </div>
        <Hidden smDown>
            <span>
                {isBufferEnd ? seconds2Minutes(loadedSeconds) : '00:00'}
            </span>
        </Hidden>
    </div>
}