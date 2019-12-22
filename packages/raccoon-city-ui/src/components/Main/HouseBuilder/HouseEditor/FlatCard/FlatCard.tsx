import React from 'react';
import {Flat} from '../../../../shared/types/flat.types';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {CardActionArea} from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import {apartmentComplexDefaultImage} from '../../../../../core/constants';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            width: 150
        },
        media: {
            height: 0,
            paddingTop: '56.25%' // 16:9
        }
    })
);

interface FlatCardProps {
    flat: Flat;
}

export function FlatCard(props: FlatCardProps) {
    const classes = useStyles();
    const {flat} = props;
    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={flat.flatNumber}
            />
            <CardActionArea>
                <CardMedia className={classes.media} image={apartmentComplexDefaultImage} />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" />
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
