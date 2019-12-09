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
    const { artistName } = state
    let artist = data[index]
    const classes = useStyles();
    const isSelected = artist.name === artistName
    return (
        <ListItem button style={style} key={index}
            className={isSelected ? classes.selected : ''}
            onClick={
                () => {
                    dispatch({
                        type: 'setArtistName',
                        payload: {
                            artistName: artist.name === "全部艺人" ? undefined : artist.name
                        }
                    })
                }
            }>
            <ListItemText primary={`${artist.name}`} className={classes.col} />
        </ListItem>
    );
}

Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
};

export default function VirtualizedList() {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, artistName, searchWord, searchType } = state
    const classes = useStyles();
    let artists = data.artists && data.artists.rows || []

    const height = window.innerHeight - 191 // 
    if (searchType === 'ar') {
        artists = artists.filter(s => s && s.name.includes(searchWord))
    }
    return (
        <div>
            <Hidden xsDown>
                <div className={classes.root}>
                    {/* <ListItem>
                        <ListItemText secondary={`歌单`} className={classes.col} />
                    </ListItem> */}
                    <ListItem button
                        className={!artistName ? classes.selected : ''}
                        onClick={
                            () => {
                                dispatch({
                                    type: 'setArtistName',
                                    payload: {
                                        artistName: undefined
                                    }
                                })
                            }
                        }>
                        <ListItemText primary={`全部艺人`} className={classes.col} />
                    </ListItem>
                    <FixedSizeList
                        height={height}
                        width='100%'
                        itemSize={46}
                        itemCount={artists.length}
                        itemData={artists}
                    >
                        {Row}
                    </FixedSizeList>
                </div>
            </Hidden>
        </div>
    )
}