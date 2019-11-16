import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {PropertyItem} from './PropertyItem/PropertyItem';
import {AddProperty} from './AddProperty/AddProperty';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
    })
);

export function PropertyList() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                    <AddProperty />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PropertyItem />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PropertyItem />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PropertyItem />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PropertyItem />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PropertyItem />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PropertyItem />
                </Grid>
            </Grid>
        </div>
    );
}
