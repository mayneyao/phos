import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { PhosPlayerContext } from './PhosPlayerContext'
import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        maxWidth: 1200,
        // backgroundColor: '#eee',
        margin: '0 auto'
    },
    col: {
        width: '30%'
    },
    smCol: {
        [theme.breakpoints.down('sm')]: {
            marginBottom: 10
        },
    },
    noSourceSong: {
        color: '#888'
    },

    nowPlayingSong: {
        color: theme.palette.primary.main
    }
}));

function Row(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, index, style } = props;
    let song = data[index]
    let artists = song.artist ? song.artist.filter(i => !!i).map(a => a.name).join(",") : '未知'
    let album = song.album ? song.album[0].name : '未知'
    const classes = useStyles();

    const { currentPlaySong } = state
    const getRowClass = () => {
        if (song.title === currentPlaySong.title) {
            return classes.nowPlayingSong
        } else if (!song.file && !song.id_163) {
            return classes.noSourceSong
        }
    }
    return (
        <ListItem button style={style} key={index}
            className={`${classes.smCol} ${getRowClass()}`}
            onClick={() => dispatch({
                type: 'playOneSong',
                payload: { song }
            })}
        >
            <Hidden xsDown>
                <ListItemText primary={`${song.title}`} className={classes.col} />
                <ListItemText primary={`${artists}`} className={classes.col} />
                <ListItemText primary={`${album}`} className={classes.col} />
            </Hidden>
            <Hidden smUp>
                <ListItemText
                    primary={`${song.title}`}
                    secondary={`${artists} - ${album}`}
                />
            </Hidden>

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

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    if (songlist) {
        if (playlistName) {
            songlist = songlist.filter(item => item.playlist && item.playlist.includes(playlistName))
        }
    }

    return (
        <>
            <Hidden xsDown>
                <ListItem>
                    <ListItemText secondary={`标题`} className={classes.col} />
                    <ListItemText secondary={`艺人`} className={classes.col} />
                    <ListItemText secondary={`专辑`} className={classes.col} />
                </ListItem>
            </Hidden>

            <FixedSizeList
                height={700}
                width='100%'
                itemSize={matches ? 60 : 46}
                itemCount={songlist.length}
                itemData={songlist}
            >

                {Row}
            </FixedSizeList>
        </>
    );
}
