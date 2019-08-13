import React from 'react'
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const PhosSlider = withStyles(({ palette }) => ({
    root: {
        color: palette.primary.main,
        height: 2,
    },
    thumb: {
        display: 'none'
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
        backgroundColor: 'rgba(0,0,0,.5)'
    }
}))(Slider)

export default PhosSlider