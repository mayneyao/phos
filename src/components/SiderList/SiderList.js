import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';

// 下面三个列表代码高度相似，后续抽象成一个通用组件。
import Playlist from './Playlist'
import ArtistList from './ArtistList'
import AlbumList from './AlbumList'

import Search from '../Search'
import { PhosPlayerContext } from '../PhosPlayerContext'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    navItem: {
        padding: 10,
        color: '#999',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    searchIcon: {
        marginRight: '-20px'
    },
}));

export default function SimpleTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [q, setQ] = React.useState();
    const [showInput, setShowInput] = React.useState(false);
    const { state, dispatch } = React.useContext(PhosPlayerContext)


    function handleSearchChange(e) {
        setQ(e.target.value)
    }

    function submitSearch() {
        dispatch({
            type: 'set',
            payload: {
                searchWord: q,
            }
        })
    }
    function showSeachInput() {
        if (showInput) {
            dispatch({
                type: 'set',
                payload: {
                    searchWord: undefined,
                }
            })
        }
        setShowInput(!showInput)
    }
    function handleChange(newValue) {
        setValue(newValue);

        // 切换 filter 是否需要重置列表
        // const indexClearNameMap = {
        //     0: ['setArtistName', 'setAlbumName'],
        //     1: ['setPlaylistName', 'setAlbumName'],
        //     2: ['setPlaylistName', 'setArtistName'],
        // }

        // const actionPayloadNameMap = {
        //     setPlaylistName: 'playlistName',
        //     setArtistName: 'artistName',
        //     setAlbumName: 'albumName'
        // }

        // indexClearNameMap[newValue].map(action => {
        //     dispatch({
        //         type: action,
        //         payload: {
        //             [actionPayloadNameMap[action]]: undefined
        //         }
        //     })
        // })
    }

    return (
        <div className={classes.root}>

            <div className={classes.nav}>
                <span className={classes.navItem} onClick={() => handleChange(0)}> 歌单 </span>
                <span className={classes.navItem} onClick={() => handleChange(1)}> 艺人 </span>
                <span className={classes.navItem} onClick={() => handleChange(2)}> 专辑 </span>
                <SearchIcon className={`${classes.navItem} ${classes.searchIcon}`} onClick={showSeachInput} />
                <Slide
                    direction="down"
                    in={showInput}
                    mountOnEnter
                    unmountOnExit
                >
                    <InputBase
                        autoFocus={true}
                        onChange={handleSearchChange}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.preventDefault()
                                submitSearch()
                            }
                        }}
                    />
                </Slide>

            </div>

            <TabPanel value={value} index={0}>
                <Playlist />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ArtistList />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AlbumList />
            </TabPanel>
        </div>
    );
}
