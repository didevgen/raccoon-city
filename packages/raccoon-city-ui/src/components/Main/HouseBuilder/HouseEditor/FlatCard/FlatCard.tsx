import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, {Fragment, memo} from 'react';
import {CardHeaderWithMenu} from '../../../../shared/components/menus/CardHeaderWithMenu';
import {Flat} from '../../../../shared/types/flat.types';
import {FlatFormDialog} from '../FlatForm/FlatForm';
import {flatDefaultImage} from '../../../../../core/constants';
import {useMutation} from '@apollo/react-hooks';
import {DELETE_FLAT} from '../../../../../graphql/mutations/flatMutation';
import {GET_GROUPED_FLATS} from '../../../../../graphql/queries/houseQuery';
import {useParams} from 'react-router-dom';

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

export const FlatCard = memo((props: FlatCardProps) => {
    const classes = useStyles();
    const {houseUuid} = useParams();
    const {flat} = props;
    const [deleteFlat] = useMutation(DELETE_FLAT);
    const [open, setOpen] = React.useState(false);
    return (
        <Fragment>
            <Card className={classes.card}>
                <CardHeaderWithMenu
                    title={flat.flatNumber}
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                >
                    <MenuItem
                        onClick={(event) => {
                            event.preventDefault();
                            setOpen(true);
                        }}
                    >
                        Редактировать
                    </MenuItem>
                    <MenuItem
                        onClick={async (event) => {
                            event.preventDefault();
                            await deleteFlat({
                                variables: {
                                    uuid: flat.id
                                },
                                refetchQueries: [
                                    {
                                        query: GET_GROUPED_FLATS,
                                        variables: {
                                            uuid: houseUuid
                                        }
                                    }
                                ]
                            });
                        }}
                    >
                        Удалить
                    </MenuItem>
                </CardHeaderWithMenu>
                <CardActionArea>
                    <CardMedia className={classes.media} image={flatDefaultImage} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </CardActionArea>
            </Card>
            <FlatFormDialog open={open} setOpen={setOpen} flat={flat} />
        </Fragment>
    );
});
