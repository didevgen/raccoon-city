import {useMutation} from '@apollo/react-hooks';
import {CardActionArea} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../../../core/constants';
import {
    DELETE_APARTMENT_COMPLEX_LAYOUT,
    EDIT_APARTMENT_COMPLEX_LAYOUT
} from '../../../../../../graphql/mutations/layoutMutation';
import {GET_APARTMENT_COMPLEX_LAYOUTS} from '../../../../../../graphql/queries/layoutQuery';
import {Confirmation} from '../../../../../shared/components/dialogs/ConfirmDialog';
import {CardHeaderWithMenu} from '../../../../../shared/components/menus/CardHeaderWithMenu';
import {StyledCard, StyledCardMedia} from '../../../../../shared/components/styled';
import {LayoutDialog} from '../../../../Images/LayoutDialog/LayoutDialog';
import {ApartmentComplexLayoutSelectionDialog} from '../ApartmentComplexLayoutSelectionDialog/ApartmentComplexLayoutSelectionDialog';
import {ApartmentComplexLayout} from '../../../../../shared/types/layout.types';

export interface ApartmentComplexLayoutCardProps {
    id: string;
    name: string;
    imageUrl?: string;
    previewImage?: string;
    layout: ApartmentComplexLayout;
}

export function ApartmentComplexLayoutCard(props: ApartmentComplexLayoutCardProps) {
    const {apartmentComplexUuid, developerUuid} = useParams();
    const [open, setOpen] = React.useState(false);
    const mutation = useMutation(EDIT_APARTMENT_COMPLEX_LAYOUT, {
        refetchQueries: [
            {
                query: GET_APARTMENT_COMPLEX_LAYOUTS,
                variables: {
                    uuid: apartmentComplexUuid
                }
            }
        ]
    });

    const [deleteMutation] = useMutation(DELETE_APARTMENT_COMPLEX_LAYOUT, {
        refetchQueries: [
            {
                query: GET_APARTMENT_COMPLEX_LAYOUTS,
                variables: {
                    uuid: apartmentComplexUuid
                }
            }
        ]
    });

    return (
        <StyledCard elevation={3}>
            <CardHeaderWithMenu title={props.name}>
                <MenuItem>
                    <ApartmentComplexLayoutSelectionDialog
                        layout={props.layout}
                        imageUrl={props.imageUrl}
                        uuid={props.id}
                    />
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Редактировать
                </MenuItem>
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
                <Link to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}`}>
                    <StyledCardMedia image={props.previewImage || apartmentComplexDefaultImage} title={props.name} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
            <LayoutDialog
                isEdit={true}
                mutation={mutation}
                downloadLink={props.imageUrl}
                setOpen={setOpen}
                open={open}
                params={{uuid: props.id, name: props.name}}
            />
        </StyledCard>
    );
}
