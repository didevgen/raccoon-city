import {Grid} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {FabButtonContainer, StyledFab, StyledLink} from '../../shared/components/styled';
import {House} from '../../shared/types/house.types';
import {HousePreview} from '../HouseBuilder/HousePreview/HousePreview';
import {useQuery} from '@apollo/react-hooks';
import {HOUSE_LIST} from '../../../graphql/queries/houseQuery';

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

interface HouseGridProps {
    houses: House[];
}

function HouseGrid({houses}: HouseGridProps) {
    return (
        <Grid container={true} spacing={2} alignItems="center">
            <Grid item={true} xs={12} md={4}>
                <AddHouseButton />
            </Grid>
            {houses.map((house) => {
                return (
                    <Grid item={true} xs={12} md={4} key={house.id}>
                        <HousePreview house={house} />
                    </Grid>
                );
            })}
        </Grid>
    );
}

export function HouseList() {
    const {uuid} = useParams();
    const {loading, error, data} = useQuery<{getHouses: House[]}>(HOUSE_LIST, {
        variables: {
            apartmentComplexId: uuid
        }
    });

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error || !data) {
        return <p>Error :(</p>;
    }

    const houses = data && data.getHouses;
    if (!houses || houses.length === 0) {
        return <EmptyHouseList />;
    } else {
        return <HouseGrid houses={houses} />;
    }
}
