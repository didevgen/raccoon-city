import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import {CardHeaderWithMenu} from '../../../shared/components/menus/CardHeaderWithMenu';

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

export interface FlatLayoutCardProps {
    id: string;
    name: string;
    imageUrl?: string;
}

export function FlatLayoutCard(props: FlatLayoutCardProps) {
    const classes = useStyles();
    const {apartmentComplexUuid, houseUuid, developerUuid} = useParams();
    return (
        <Card className={classes.card} elevation={3}>
            <CardHeaderWithMenu title={props.name}>
                <MenuItem>Редактировать</MenuItem>
                <MenuItem>Удалить</MenuItem>
            </CardHeaderWithMenu>
            <CardActionArea>
                <Link
                    to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/house/${houseUuid}/layout/${props.id}/info`}
                >
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
