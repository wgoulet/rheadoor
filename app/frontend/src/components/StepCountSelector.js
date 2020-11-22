import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const Selector = withStyles({
    root: {
    color: '#3880ff',
    height: 1,
    padding: '15px 0',
    marginRight: '30px',
    marginLeft: '100px',
    marginTop: '15px'
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    '&:focus, &:hover, &$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 1,
  },
  rail: {
    height: 1,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);

function valuetext(value) {
  return `${value}`;
}

function value(value) {
    return {value};
}

const sliderLabel = {
      marginRight: '30px',
      marginLeft: '100px',
      marginTop: '50px',
    };

export default function StepCountSelector({displayLabel,min,max,defaultValue,step,onChangeCommitted}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography gutterBottom style={sliderLabel}>{displayLabel}</Typography>
      <Selector valueLabelDisplay="auto" aria-label={value} defaultValue={defaultValue} step={step} aria-labelledby="discrete-slider"
      getAriaValueText={valuetext} marks min={min} max={max} valueLabelDisplay="on" onChangeCommitted={onChangeCommitted}/>
    </div>
  );
}
