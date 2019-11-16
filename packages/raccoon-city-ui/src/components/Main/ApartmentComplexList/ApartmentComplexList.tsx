import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {ApartmentComplex} from './ApartmentComplex/ApartmentComplex';
import {AddProperty} from './AddApartmentComplexList/AddProperty';

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

export function ApartmentComplexList() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                    <AddProperty />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ApartmentComplex />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ApartmentComplex />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ApartmentComplex />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ApartmentComplex />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ApartmentComplex />
                </Grid>
                <Grid item xs={12} md={3}>
                    <ApartmentComplex />
                </Grid>
            </Grid>
        </div>
    );
}
