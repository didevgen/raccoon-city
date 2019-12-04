import {Grid} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {FabButtonContainer, StyledFab, StyledLink} from '../../shared/components/styled';
import {House} from '../../shared/types/house.types';

const EmptyHouseWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    text-align: center;
    min-height: 320px;
    flex-direction: column;
`;

const StyledAddIcon = styled(AddIcon)`
    margin-right: 8px;
`;

export function AddHouseButton() {
    const {uuid} = useParams();
    return (
        <FabButtonContainer>
            <StyledLink to={`/apartmentComplex/${uuid}/house/new`}>
                <StyledFab color="secondary" aria-label="add">
                    <AddIcon />
                </StyledFab>
            </StyledLink>
        </FabButtonContainer>
    );
}

function EmptyHouseList() {
    const {uuid} = useParams();
    return (
        <EmptyHouseWrapper>
            <Typography variant="h4" gutterBottom={true}>
                У этого жилищного комлпекса еще нет домов. Желаете создать?
            </Typography>
            <div>
                <StyledLink to={`/apartmentComplex/${uuid}/house/new`}>
                    <Fab variant="extended" size="medium" color="primary" aria-label="add">
                        <StyledAddIcon />
                        Создать
                    </Fab>
                </StyledLink>
            </div>
        </EmptyHouseWrapper>
    );
}

interface HouseListProps {
    houses: House[];
}

function HouseGrid({houses}: HouseListProps) {
    return (
        <Grid container={true} spacing={2} alignItems="center">
            <Grid item={true} xs={12} md={3}>
                <AddHouseButton />
            </Grid>
        </Grid>
    );
}

export function HouseList(props: HouseListProps) {
    const {houses} = props;
    if (!houses || houses.length === 0) {
        return <EmptyHouseList />;
    } else {
        return <HouseGrid {...props} />;
    }
}
