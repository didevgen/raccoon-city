import {useParams} from 'react-router-dom';
import {FabButtonContainer, StyledFab, StyledLink} from '../../../../shared/components/styled';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';

export function AddFlatCard() {
    const {uuid} = useParams();
    return (
        <FabButtonContainer>
            <StyledLink to={`/apartmentComplex/${uuid}/create/house`}>
                <StyledFab color="secondary" aria-label="add">
                    <AddIcon />
                </StyledFab>
            </StyledLink>
        </FabButtonContainer>
    );
}
