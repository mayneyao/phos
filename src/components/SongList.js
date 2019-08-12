import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { PhosPlayerContext } from './PhosPlayerContext'


const PhosColor = "#38d4c9"
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        maxWidth: 1200,
        backgroundColor: '#eee',
        margin: '0 auto'
    },
    col: {
        width: '30%'
    },
    noSourceSong: {
        color: '#888'
    },
    nowPlayingSong: {
        color: PhosColor
    }
}));

function Row(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, index, style } = props;
    let song = data[index]
    let artists = song.artist.map(a => a.name).join(",")
    const classes = useStyles();

    const { currentPlaySong, phosColor } = state
    const getRowClass = () => {
        if (song.title === currentPlaySong.title) {
            return classes.nowPlayingSong
        } else if (!song.file) {
            return classes.noSourceSong
        }
    }
    return (
        <ListItem button style={style} key={index}
            className={getRowClass()}
            onClick={() => dispatch({
                type: 'playOneSong',
                payload: { song }
            })}
        >
            <ListItemText primary={`${song.title}`} className={classes.col} />
            <ListItemText primary={`${artists}`} className={classes.col} />
            <ListItemText primary={`${song.album[0].name}`} className={classes.col} />
        </ListItem>
    );
}

Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
};

export default function VirtualizedList() {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, playlistName } = state
    const classes = useStyles();
    let songlist = data.songs ? data.songs.rows : []
    if (songlist) {
        if (playlistName) {
            songlist = songlist.filter(item => item.playlist && item.playlist.includes(playlistName))
        }
    }

    return (

        <FixedSizeList
            height={800}
            width='100%'
            itemSize={46}
            itemCount={songlist.length}
            itemData={songlist}
        >

            {Row}
        </FixedSizeList>

    );
}
