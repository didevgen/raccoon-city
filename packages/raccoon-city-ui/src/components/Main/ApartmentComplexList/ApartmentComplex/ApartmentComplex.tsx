import {useMutation} from '@apollo/react-hooks';
import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import {DELETE_APARTMENT_COMPLEX} from '../../../../graphql/mutations/apartmentComplexMutation';
import {ALL_APARTMENT_COMPLEXES} from '../../../../graphql/queries/apartmentComplexQuery';
import {Confirmation} from '../../../shared/components/dialogs/ConfirmDialog';
import {CardHeaderWithMenu} from '../../../shared/components/menus/CardHeaderWithMenu';
import {StyledLink} from '../../../shared/components/styled';

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
    const {developerUuid} = useParams();
    const [deleteMutation] = useMutation(DELETE_APARTMENT_COMPLEX, {
        refetchQueries: [
            {
                query: ALL_APARTMENT_COMPLEXES,
                variables: {
                    developerUuid
                }
            }
        ]
    });

    return (
        <Card className={classes.card}>
            <CardHeaderWithMenu title={props.name}>
                <StyledLink to={`/developers/${developerUuid}/apartmentComplex/${props.id}/edit`}>
                    <MenuItem>Редактировать</MenuItem>
                </StyledLink>
                <Confirmation>
                    {(confirmFn: (cb: () => void) => void) => {
                        return (
                            <MenuItem
                                onClick={() => {
                                    confirmFn(() => async () => {
                                        await deleteMutation({
                                            variables: {
                                                uuid: props.id
                                            }
                                        });
                                    });
                                }}
                            >
                                Удалить
                            </MenuItem>
                        );
                    }}
                </Confirmation>
            </CardHeaderWithMenu>
            <CardActionArea>
                <Link to={`/developers/${developerUuid}/apartmentComplex/${props.id}/overview`}>
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
