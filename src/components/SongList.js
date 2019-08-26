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
import logo163 from '../static/logo163.jpg'

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
    },
    logo163: {
        marginBottom: -2,
        marginRight: 5,
        width: 16,
        height: 16

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
                <ListItemText primary={<span>{!song.file && song.id_163 && <img src={logo163} className={classes.logo163} />}{song.title}</span>} className={classes.col} />
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
    const { data, playlistName, artistName, albumName, filterBy, searchWord, searchType } = state
    const classes = useStyles();
    let songlist = data.songs ? data.songs.rows : []

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    if (songlist) {
        // 首先基于歌单艺人和专辑过滤歌曲
        switch (filterBy) {
            case 'playlistName':
                if (playlistName) songlist = songlist.filter(item => item.playlist && item.playlist.includes(playlistName))
                break
            case 'artistName':
                if (artistName) songlist = songlist.filter(item => item.artist && item.artist.filter(i => i).map(a => a.name).includes(artistName))
                break
            case 'albumName':
                if (albumName) songlist = songlist.filter(item => item.album && item.album.filter(i => i).map(a => a.name).includes(albumName))
                break
        }
        // 如果存在搜索词，则再次过滤
        if (searchWord && searchType === 'so') {
            songlist = songlist.filter(item => item.title.includes(searchWord))
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
