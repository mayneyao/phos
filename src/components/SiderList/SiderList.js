import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Hidden from '@material-ui/core/Hidden';


// 下面三个列表代码高度相似，后续抽象成一个通用组件。
import Playlist from './Playlist'
import ArtistList from './ArtistList'
import AlbumList from './AlbumList'

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


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'right',
        },
    },
    navItem: {
        padding: 10,
        color: '#999',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    searchIcon: {
        marginRight: '-20px',
        [theme.breakpoints.down('sm')]: {
            marginRight: 0,
        },
    },
    selectNavItem: {
        color: theme.palette.primary.main
    },
    infoIcon: {
        color: '#eee',
        '$:hover': {
            cursor: 'pointer'
        }
    }
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
        if (/^[ap][rl][:：]/.test(q) && !q.startsWith('pr')) {
            // 高级搜索
            let sType = q.slice(0, 2)
            let sWord = q.slice(3)
            const typeMap = {
                'pl': 'playlistName',
                'ar': 'artistName',
                'al': 'albumName',
            }
            switch (sType) {
                case 'pl':
                    setValue(0)
                    break
                case 'ar':
                    setValue(1)
                    break
                case 'al':
                    setValue(2)
                    break
            }


            dispatch({
                type: 'set',
                payload: {
                    searchWord: sWord,
                    searchType: sType,
                    // filterBy: typeMap[sType],
                    // [typeMap[sType]]: sWord
                }
            })
        } else {
            dispatch({
                type: 'set',
                payload: {
                    searchWord: q,
                    searchType: 'so'
                }
            })
        }
    }
    function showSeachInput() {
        if (showInput) {
            dispatch({
                type: 'set',
                payload: {
                    searchWord: undefined,
                    searchType: 'so'
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
                <Hidden xsDown>
                    <span className={`${classes.navItem} ${value === 0 ? classes.selectNavItem : ''}`} onClick={() => handleChange(0)}> 歌单 </span>
                </Hidden>
                <Hidden xsDown>
                    <span className={`${classes.navItem} ${value === 1 ? classes.selectNavItem : ''}`} onClick={() => handleChange(1)}> 艺人 </span>
                </Hidden>
                <Hidden xsDown>
                    <span className={`${classes.navItem} ${value === 2 ? classes.selectNavItem : ''}`} onClick={() => handleChange(2)}> 专辑 </span>
                </Hidden>
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
                        endAdornment={
                            <Hidden smDown>
                                <InputAdornment position="end">
                                    <Tooltip title={<div>
                                        <div>默认搜索歌曲名称,添加前缀可以使用高级搜索</div>
                                        <div>pl:歌单名</div>
                                        <div>ar:艺人名</div>
                                        <div>al:专辑名</div>
                                    </div>}>
                                        <InfoIcon className={classes.infoIcon} />
                                    </Tooltip>
                                </InputAdornment>
                            </Hidden>
                        }
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
