import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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

export function MainChessGrid() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper elevation={3} />
            <Paper elevation={3} />
            <Paper elevation={3} />
            <Paper elevation={3} />
        </div>
    );
}
