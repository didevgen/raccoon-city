import React from 'react';
import {House} from '../../../shared/types/house.types';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {CardActionArea} from '@material-ui/core';
import {Link} from 'react-router-dom';
import CardMedia from '@material-ui/core/CardMedia';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {useParams} from 'react-router';

interface HousePreviewProps {
    house: House;
}

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

export function HousePreview(props: HousePreviewProps) {
    const {house} = props;
    const {uuid} = useParams();
    const classes = useStyles();
    const image = house.images.CHESS_GRID ? house.images.CHESS_GRID.downloadUrl : apartmentComplexDefaultImage;
    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={house.name}
            />
            <CardActionArea>
                <Link to={`/apartmentComplex/${uuid}/house/${house.id}`}>
                    <CardMedia className={classes.media} image={image} title={house.name} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card>
    );
}
