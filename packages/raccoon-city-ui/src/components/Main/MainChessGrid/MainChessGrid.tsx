import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {setRouteParams} from '../../../redux/actions';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                width: theme.spacing(12),
                height: theme.spacing(12)
            }
        }
    })
);

export const MainChessGrid = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params))
}))(({applyParams}) => {
    const params = useParams();

    useEffect(() => {
        applyParams(params);
    }, [applyParams, params]);
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper elevation={3} />
            <Paper elevation={3} />
            <Paper elevation={3} />
            <Paper elevation={3} />
        </div>
    );
});
