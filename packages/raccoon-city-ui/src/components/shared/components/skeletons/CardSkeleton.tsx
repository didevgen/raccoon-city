import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
        margin: theme.spacing(2)
    },
    media: {
        height: 190
    }
}));

function Media() {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
                title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
                subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <Skeleton animation="wave" variant="rect" className={classes.media} />

            <CardContent>
                <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
                <Skeleton animation="wave" height={10} width="80%" />
            </CardContent>
        </Card>
    );
}

Media.propTypes = {
    loading: PropTypes.bool
};

export function CardSkeleton() {
    return (
        <Grid container={true} spacing={3} alignItems="center">
            <Grid item={true} xs={12} md={4}>
                <Media />
            </Grid>
            <Grid item={true} xs={12} md={4}>
                <Media />
            </Grid>
            <Grid item={true} xs={12} md={4}>
                <Media />
            </Grid>
        </Grid>
    );
}
