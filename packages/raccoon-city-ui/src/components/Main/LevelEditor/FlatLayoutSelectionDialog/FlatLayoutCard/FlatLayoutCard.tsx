import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles({
    root: {
        maxWidth: 345
    },
    media: {
        height: 280
    }
});

interface FlatLayoutCardProps {
    imageUrl: string;
    name: string;
    onSelect: () => void;
}
export function FlatLayoutCard(props: FlatLayoutCardProps) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={props.onSelect}>
                <CardMedia className={classes.media} image={props.imageUrl} title="Contemplative Reptile" />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
