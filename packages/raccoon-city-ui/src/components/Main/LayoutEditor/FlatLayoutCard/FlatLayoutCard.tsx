import {useMutation} from '@apollo/react-hooks';
import {CardActionArea} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import {DELETE_FLAT_LAYOUT} from '../../../../graphql/mutations/layoutMutation';
import {GET_LAYOUTS} from '../../../../graphql/queries/layoutQuery';
import {Confirmation} from '../../../shared/components/dialogs/ConfirmDialog';
import {CardHeaderWithMenu} from '../../../shared/components/menus/CardHeaderWithMenu';
import {StyledCard, StyledCardMedia} from '../../../shared/components/styled';

export interface FlatLayoutCardProps {
    id: string;
    name: string;
    imageUrl?: string;
}

export function FlatLayoutCard(props: FlatLayoutCardProps) {
    const {apartmentComplexUuid, houseUuid, developerUuid} = useParams();

    const [deleteMutation] = useMutation(DELETE_FLAT_LAYOUT, {
        refetchQueries: [
            {
                query: GET_LAYOUTS,
                variables: {
                    houseId: houseUuid
                }
            }
        ]
    });

    return (
        <StyledCard elevation={3}>
            <CardHeaderWithMenu title={props.name}>
                <MenuItem>Редактировать</MenuItem>
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
                <Link
                    to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/house/${houseUuid}/layout/${props.id}/info`}
                >
                    <StyledCardMedia image={props.imageUrl || apartmentComplexDefaultImage} title={props.name} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </StyledCard>
    );
}
