import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import {Link} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            maxWidth: 345
        },
        media: {
            height: 0,
            paddingTop: '56.25%' // 16:9
        }
    })
);

export interface ApartmentComplexProps {
    id: string;
    name: string;
    imageUrl?: string;
}
export function ApartmentComplex(props: ApartmentComplexProps) {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={props.name}
            />
            <CardActionArea>
                <Link to={`/apartmentComplex/${props.id}/overview`}>
                    <CardMedia
                        className={classes.media}
                        image={props.imageUrl || apartmentComplexDefaultImage}
                        title={props.name}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card>
    );
}
