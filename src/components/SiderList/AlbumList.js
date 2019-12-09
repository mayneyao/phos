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
    const { albumName } = state
    let album = data[index]
    const classes = useStyles();
    const isSelected = album.name === albumName
    return (
        <ListItem button style={style} key={index}
            className={isSelected ? classes.selected : ''}
            onClick={
                () => {
                    dispatch({
                        type: 'setAlbumName',
                        payload: {
                            albumName: album.name === "全部专辑" ? undefined : album.name
                        }
                    })
                }
            }>
            <ListItemText primary={`${album.name}`} className={classes.col} />
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
    const { data, albumName, searchWord, searchType } = state
    const classes = useStyles();
    let albums = data.albums && data.albums.rows || []
    const height = window.innerHeight - 191 // 

    if (searchType === 'al') {
        albums = albums.filter(s => s.name.includes(searchWord))
    }

    return (
        <div>
            <Hidden xsDown>
                <div className={classes.root}>
                    {/* <ListItem>
                        <ListItemText secondary={`歌单`} className={classes.col} />
                    </ListItem> */}
                    <ListItem button
                        className={!albumName ? classes.selected : ''}
                        onClick={
                            () => {
                                dispatch({
                                    type: 'setAlbumName',
                                    payload: {
                                        albumName: undefined
                                    }
                                })
                            }
                        }>
                        <ListItemText primary={`全部专辑`} className={classes.col} />
                    </ListItem>
                    <FixedSizeList
                        height={height}
                        width='100%'
                        itemSize={46}
                        itemCount={albums.length}
                        itemData={albums}
                    >
                        {Row}
                    </FixedSizeList>
                </div>
            </Hidden>
        </div>
    )
}