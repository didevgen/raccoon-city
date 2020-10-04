import {useMutation} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import styled from 'styled-components';
import {apartmentComplexDefaultImage} from '../../../../../../core/constants';
import {APARTMENT_COMPLEX_DELETE_AREA} from '../../../../../../graphql/mutations/layoutMutation';
import {House} from '../../../../../shared/types/house.types';
import {ApartmentComplexLayout} from '../../../../../shared/types/layout.types';
import {GET_APARTMENT_COMPLEX_LAYOUTS} from '../../../../../../graphql/queries/layoutQuery';
import {useParams} from 'react-router-dom';

const LayoutImage = styled.img`
    width: 100%;
`;

interface ApartmentComplexSelectionPreviewDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    layout: ApartmentComplexLayout;
    selectedHouse: {house: House};
}

export function ApartmentComplexSelectionPreviewDialog(props: ApartmentComplexSelectionPreviewDialogProps) {
    const [deleteArea] = useMutation(APARTMENT_COMPLEX_DELETE_AREA);
    const {apartmentComplexUuid} = useParams();
    const {open, setOpen, layout, selectedHouse} = props;
    return (
        <div>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{selectedHouse?.house?.name}</DialogTitle>
                <DialogContent>
                    <LayoutImage src={selectedHouse?.house?.images?.CHESS_GRID?.downloadUrl || apartmentComplexDefaultImage} />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpen(false);
                        }}
                        color="primary"
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            await deleteArea({
                                variables: {
                                    layoutId: layout.id,
                                    houseId: selectedHouse.house.id
                                },
                                refetchQueries: [
                                    {
                                        query: GET_APARTMENT_COMPLEX_LAYOUTS,
                                        variables: {
                                            uuid: apartmentComplexUuid
                                        }
                                    }
                                ]
                            });
                            setOpen(false);
                        }}
                        color="secondary"
                    >
                        Удалить область
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
