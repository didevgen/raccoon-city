import React from 'react';
import {Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import {Link, useParams} from 'react-router-dom';

const ButtonContainer = styled.div`
    height: 140px;
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

export function AddProperty() {
    const {developerUuid} = useParams();

    return (
        <ButtonContainer>
            <Link to={`/developers/${developerUuid}/apartmentComplex/new`}>
                <StyledFab color="secondary" aria-label="add">
                    <AddIcon />
                </StyledFab>
            </Link>
        </ButtonContainer>
    );
}
