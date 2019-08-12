import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

import { PhosPlayerContext } from './PhosPlayerContext'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: 400,
        maxWidth: 1200,
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto'
    },
    col: {
        width: '30%'
    },
    noSourceSong: {
        color: '#888'
    }
}));

function Row(props) {
    const { state, dispatch } = React.useContext(PhosPlayerContext)
    const { data, index, style } = props;
    let song = data[index]
    let artists = song.artist.map(a => a.name).join(",")
    const classes = useStyles();
    return (
        <ListItem button style={style} key={index} className={!song.file && classes.noSourceSong}
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
    const { data } = state
    const classes = useStyles();

    let d = data.songs ? data.songs.rows : []
    console.log(d)

    return (
        <div className={classes.root}>
            <FixedSizeList
                height={400}
                width='100%'
                itemSize={46}
                itemCount={d.length}
                itemData={d}
            >

                {Row}
            </FixedSizeList>
        </div>
    );
}
