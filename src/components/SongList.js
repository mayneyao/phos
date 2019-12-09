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
import logo_163 from '../static/logo_163.jpg'
import logo_notion from '../static/logo_notion.png'
import logo_ytb from '../static/logo_ytb.png'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        maxWidth: 1200,
        // backgroundColor: '#eee',
        margin: '0 auto'
    },
    title: {
        color: '#999',
        height: 42
    },
    active: {
        color: theme.palette.primary.main
    },
    nav: {
        paddingLeft: 16
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
    logo: {
        marginBottom: -2,
        marginRight: 5,
        width: 16,
        height: 16
    },
    addPlaylist: {
        width: 100
    }
}));



function Row(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, index, style } = props;
    let song = data[index]
    let artists = song.artist ? song.artist.filter(i => !!i).map(a => a.name).join(",") : '未知'

    let album
    try {
        album = song.album ? song.album[0] ? song.album[0].name : '未知' : '未知'
    } catch (error) {
        console.log(song.album)
    }

    const playlists = state.allPlaylist


    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [showPlaylist, setShowPlaylist] = React.useState(null);

    const open = Boolean(anchorEl) && Boolean(showPlaylist);
    const id = open ? 'simple-popover' : undefined;


    function handlePlaySong(e) {
        if (e.type === 'click' && !Boolean(anchorEl)) {
            dispatch({
                type: 'playOneSong',
                payload: { song }
            })
        } else if (e.type === 'contextmenu') {
            console.log('Right click');
        }
    }
    function handleEnter(event) {
        event.preventDefault()
        setShowPlaylist(event.currentTarget);
    }

    function handleLeave(event) {
        event.preventDefault()
        setShowPlaylist(null);
    }

    function handleRightClick(event) {
        console.log(song)
        event.preventDefault()
        setAnchorEl(event.currentTarget);
    }

    function handleClose(event) {
        setAnchorEl(null);
        setShowPlaylist(null);
    }

    function handleAddOneSongToCurrentPlaylist() {
        dispatch({
            type: 'addOneSongToCurrentPlaylist',
            payload: {
                song
            }
        })
        handleClose()
    }
    function handleAddSongToPlaylist(p) {
        console.log(song.playlist)
        song.playlist = song.playlist ? [...song.playlist, p] : [p]
        handleClose()
    }

    function handleRemoveSongFromPlaylist() {
        song.playlist = song.playlist.filter(i => !(i == state.playlistName))
        handleClose()
    }

    function handleRemoveSongFromCurrentPlaylist() {
        dispatch({
            type: 'set',
            payload: {
                currentPlaylist: state.currentPlaylist.filter(i => !(i.title === song.title))
            }

        })
        handleClose()
    }

    const { currentPlaySong } = state
    const getRowClass = () => {
        if (song.title === currentPlaySong.title) {
            return classes.nowPlayingSong
        } else if (!song.file && !song.id_163) {
            return classes.noSourceSong
        }
    }

    const getSourceLogo = () => {
        let logo
        switch (song.source) {
            case "file":
                logo = logo_notion
                break
            case "163":
                logo = logo_163
                break
            case "ytb":
                logo = logo_ytb
                break
            default:
                logo = logo_notion
        }
        return logo
    }
    let logo = getSourceLogo()
    return (
        <ListItem button style={style} key={index}
            className={`${classes.smCol} ${getRowClass()}`}
            onClick={handlePlaySong}
            onContextMenu={handleRightClick}
        >
            <ClickAwayListener onClickAway={handleClose}>
                <div>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {!state.showNowPlaylist && <MenuItem onClick={handleAddOneSongToCurrentPlaylist}>加入当前播放列表</MenuItem>}
                        {
                            !state.showNowPlaylist && state.playlistName && <MenuItem onClick={handleRemoveSongFromPlaylist}>从<span style={{ color: 'red' }}>{state.playlistName}</span>中移除此歌曲</MenuItem>
                        }
                        {
                            state.showNowPlaylist && <MenuItem onClick={handleRemoveSongFromCurrentPlaylist}>从当前播放队列中移除此歌曲</MenuItem>
                        }
                        {/* <MenuItem
                            aria-describedby={id}
                            anchorEl={showPlaylist}
                            onMouseEnter={handleEnter}
                            // onClick={handleEnter}
                            onMouseLeave={handleLeave}
                        >
                            添加到歌单
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={showPlaylist}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <Paper id="menu-list-grow">
                                    <MenuList>
                                        {
                                            song.playlist
                                                ? playlists.filter(p => !song.playlist.includes(p)).map(p => <MenuItem onClick={() => handleAddSongToPlaylist(p)}>{p}</MenuItem>)
                                                : playlists.map(p => <MenuItem onClick={() => handleAddSongToPlaylist(p)}>{p}</MenuItem>)
                                        }
                                    </MenuList>
                                </Paper>
                            </Popover>

                        </MenuItem> */}
                    </Menu>
                </div>
            </ClickAwayListener>
            <Hidden xsDown>
                <ListItemText primary={<span><img src={logo} className={classes.logo} />{song.title}</span>} className={classes.col} />
                <ListItemText primary={`${artists}`} className={classes.col} />
                <ListItemText primary={`${album}`} className={classes.col} />
                <ListItemText primary={`${(new Date(song.created_time)).toLocaleString()}`} className={classes.col} />
            </Hidden>
            <Hidden smUp>
                <ListItemText
                    primary={<span><img src={logo} className={classes.logo} />{song.title}</span>}
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
    const { data, playlistName, artistName, albumName, filterBy, searchWord, searchType, showNowPlaylist, currentPlaylist } = state
    const classes = useStyles();
    let songlist = data.songs ? data.songs.rows : []

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const height = window.innerHeight - 185

    function playSongs() {
        // 播放第一首
        dispatch({
            type: 'playOneSong',
            payload: {
                song: songlist[0]
            }
        })
        dispatch({
            type: 'set',
            payload: {
                currentPlaylist: songlist
            }
        })
    }

    if (songlist) {
        if (showNowPlaylist) {
            // showNowPlaylist 显示当前播放列表
            songlist = currentPlaylist
        } else {
            // 首先基于歌单艺人和专辑过滤歌曲
            // 非移动端点击歌单艺人和专辑时，名称精确匹配
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
            // 模糊名称匹配
            if (searchWord) {
                switch (searchType) {
                    case 'so':
                        let reg = new RegExp(searchWord, 'i')
                        songlist = songlist.filter(item => reg.test(item.title))
                        break
                    case 'pl':
                        songlist = songlist.filter(item => item.playlist && item.playlist.join("").includes(searchWord))
                        break
                    case 'ar':
                        songlist = songlist.filter(item => item.artist && item.artist.filter(i => i).map(a => a.name).join("").includes(searchWord))
                        break
                    case 'al':
                        songlist = songlist.filter(item => item.album && item.album.filter(i => i).map(a => a.name).join("").includes(searchWord))
                        break
                }
            }
        }
    }


    return (
        <>
            <div className={classes.title}>
                {showNowPlaylist ? <span className={classes.nav}>播放队列</span> : <Button
                    color="primary"
                    onClick={playSongs}
                >播放</Button>}
                {!showNowPlaylist && filterBy === 'playlistName' ? playlistName && `歌单：${playlistName} 中的歌曲` : ''}
                {!showNowPlaylist && filterBy === 'artistName' ? artistName && `艺人：${artistName} 的歌曲` : ''}
                {!showNowPlaylist && filterBy === 'albumName' ? albumName && `专辑：${albumName} 中的歌曲` : ''}
                {!showNowPlaylist && !playlistName && !artistName && !albumName && "全部歌曲"}
            </div>
            <Hidden xsDown>
                <ListItem>
                    <ListItemText secondary={`标题`} className={classes.col} />
                    <ListItemText secondary={`艺人`} className={classes.col} />
                    <ListItemText secondary={`专辑`} className={classes.col} />
                    <ListItemText secondary={`添加时间`} className={classes.col} />
                </ListItem>
            </Hidden>

            <FixedSizeList
                height={height}
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
