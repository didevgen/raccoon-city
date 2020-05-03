import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import {GET_SECTION} from '../../../../../graphql/queries/flatQuery';
import {StyledCardMedia} from '../../../../shared/components/styled';

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
    sectionId: string;
    maxLevel: number;
}

export const FlatCard = memo((props: FlatCardProps) => {
    const classes = useStyles();
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
                                        query: GET_SECTION,
                                        variables: {
                                            sectionId: props.sectionId
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
                    <StyledCardMedia image={flatDefaultImage} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </CardActionArea>
            </Card>
            <FlatFormDialog
                open={open}
                setOpen={setOpen}
                flat={flat}
                maxLevel={props.maxLevel}
                sectionId={props.sectionId}
            />
        </Fragment>
    );
});
