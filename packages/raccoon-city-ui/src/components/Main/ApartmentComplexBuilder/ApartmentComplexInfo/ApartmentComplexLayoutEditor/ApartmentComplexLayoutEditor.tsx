import {MutationTuple, useMutation} from '@apollo/react-hooks';
import {Fab} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import {useParams} from 'react-router';
import styled from 'styled-components';
import {CREATE_APARTMENT_COMPLEX_LAYOUT} from '../../../../../graphql/mutations/layoutMutation';
import {GET_APARTMENT_COMPLEX_LAYOUTS} from '../../../../../graphql/queries/layoutQuery';
import {LayoutDialog} from '../../../Images/LayoutDialog/LayoutDialog';
import {ApartmentComplexLayoutList} from './ApartmentComplexLayoutList/ApartmentComplexLayoutList';

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledFab = styled(Fab)`
    &.MuiFab-root {
        width: 140px;
        height: 140px;
        .MuiSvgIcon-root {
            width: 3em;
            height: 3em;
        }
    }
`;

interface NewLayoutProps {
    uuid: string;
    mutation: MutationTuple<any, any>;
}

function CreateLayout({uuid, mutation}: NewLayoutProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <ButtonContainer>
            <StyledFab
                color="secondary"
                aria-label="add"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <AddIcon />
            </StyledFab>
            <LayoutDialog
                mutation={mutation}
                setOpen={setOpen}
                open={open}
                params={{uuid}}
                ratio={['1280x720', '1600x900', '1920x1080', '...']}
            />
        </ButtonContainer>
    );
}

export function ApartmentComplexLayoutEditor() {
    const {apartmentComplexUuid: uuid} = useParams();
    const mutation = useMutation(CREATE_APARTMENT_COMPLEX_LAYOUT, {
        refetchQueries: [
            {
                query: GET_APARTMENT_COMPLEX_LAYOUTS,
                variables: {
                    uuid
                }
            }
        ]
    });

    if (!uuid) {
        return null;
    }

    return (
        <Grid container={true} spacing={3} alignItems="center">
            <Grid item={true} xs={12} md={3}>
                <CreateLayout mutation={mutation} uuid={uuid} />
            </Grid>
            <ApartmentComplexLayoutList />
        </Grid>
    );
}
