import React from 'react'
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const PhosSlider = withStyles(({ palette }) => ({
    root: {
        color: palette.primary.main,
        height: 4,
    },
    thumb: {
        height: 8,
        width: 8,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -2,
        // marginLeft: 0,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 4,
        borderRadius: 2,
    },
    rail: {
        height: 4,
        borderRadius: 2,
    }
}))(Slider)

export default PhosSlider