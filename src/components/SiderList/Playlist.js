import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { PhosPlayerContext } from '../PhosPlayerContext'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        // backgroundColor: theme.palette.background.paper,
        margin: '0 auto'
    },
    col: {
        width: '100%'
    },
    selected: {
        color: theme.palette.primary.main,
        borderLeft: `4px solid ${theme.palette.primary.main}`
    }
}));

function Row(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, index, style } = props;
    const { playlistName } = state
    let playlist = data[index]
    const classes = useStyles();
    const isSelected = playlist.value === playlistName && !state.showNowPlaylist
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

    // > sm menu
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, playlistName, searchType, searchWord, showNowPlaylist } = state
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

    if (searchType === 'pl') {
        playlists = playlists.filter(s => s && s.value.includes(searchWord))
    }

    // < sm menu
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose(playlistName) {
        setAnchorEl(null);
        dispatch({
            type: 'setPlaylistName',
            payload: {
                playlistName
            }
        })
    }

    return (
        <div>
            <Hidden xsDown>
                <div className={classes.root}>
                    {/* <ListItem>
                        <ListItemText secondary={`歌单`} className={classes.col} />
                    </ListItem> */}
                    <ListItem button
                        className={!playlistName && !showNowPlaylist ? classes.selected : ''}
                        onClick={
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
                        height={700}
                        width='100%'
                        itemSize={46}
                        itemCount={playlists.length}
                        itemData={playlists}
                    >
                        {Row}
                    </FixedSizeList>
                </div>
            </Hidden>
            {/* <Hidden smUp>
                <div>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        {playlistName || '全部歌曲'}
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => handleClose()}
                    >
                        <MenuItem onClick={() => handleClose(undefined)}>全部歌曲</MenuItem>
                        {
                            playlists.map(playlist => <MenuItem key={playlist.value} onClick={() => handleClose(playlist.value)}>{playlist.value}</MenuItem>)
                        }
                    </Menu>
                </div>

            </Hidden> */}
        </div>
    )
}