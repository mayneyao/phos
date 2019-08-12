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
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto'
    },
    col: {
        width: '100%'
    },
    selected: {
        color: PhosColor,
        borderLeft: `4px solid ${PhosColor}`
    }
}));

function Row(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, index, style } = props;
    const { playlistName } = state
    let playlist = data[index]
    const classes = useStyles();
    const isSelected = playlist.value === playlistName
    return (
        <ListItem button style={style} key={index}
            className={isSelected ? classes.selected : ''}
            onClick={
                () => {
                    dispatch({
                        type: 'setPlaylistName',
                        payload: {
                            playlistName: playlist.value === "全部歌曲" ? undefined : playlist.value
                        }
                    })
                }
            }>
            <ListItemText primary={`${playlist.value}`} className={classes.col} />
        </ListItem>
    );
}

Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
};

export default function VirtualizedList() {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data } = state
    const classes = useStyles();
    let songTableSchema = data.songs ? data.songs.schema : []
    let playlists = []
    let playlistRawData = Object.entries(songTableSchema).map(i => {
        let [key, item] = i
        return item
    }).find(item => item.name === "playlist" && item.type === "multi_select")

    if (playlistRawData) {
        playlists = playlistRawData.options
    }
    return (
        <div className={classes.root}>
            <ListItem button onClick={
                () => {
                    dispatch({
                        type: 'setPlaylistName',
                        payload: {
                            playlistName: undefined
                        }
                    })
                }
            }>
                <ListItemText primary={`全部歌曲`} className={classes.col} />
            </ListItem>
            <FixedSizeList
                height={800}
                width='100%'
                itemSize={46}
                itemCount={playlists.length}
                itemData={playlists}
            >
                {Row}
            </FixedSizeList>
        </div>
    );
}
