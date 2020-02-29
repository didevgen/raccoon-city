import {useQuery} from '@apollo/react-hooks';
import {Grid} from '@material-ui/core';
import React from 'react';
import {useParams} from 'react-router';
import styled from 'styled-components';
import {GET_LAYOUTS} from '../../../../../graphql/queries/layoutQuery';
import {HouseLayout} from '../../../../shared/types/layout.types';
import {FlatLayoutCard} from '../FlatLayoutCard/FlatLayoutCard';

const LayoutContainer = styled.div`
    padding: 24px;
`;

interface FlatLayoutSelectionListProps {
    onSelect: (layout: HouseLayout) => void;
}

export function FlatLayoutSelectionList(props: FlatLayoutSelectionListProps) {
    const {houseUuid} = useParams();
    const {loading, error, data} = useQuery(GET_LAYOUTS, {
        variables: {
            houseId: houseUuid
        }
    });

    if (loading || error) {
        return null;
    }

    return (
        <LayoutContainer>
            <Grid container={true} spacing={2}>
                {data.getFlatLayouts.map((layout: HouseLayout) => {
                    return (
                        <Grid item={true} xs={12} md={3} key={layout.id}>
                            <FlatLayoutCard
                                imageUrl={layout.image.previewImageUrl}
                                name={layout.name}
                                onSelect={() => {
                                    props.onSelect(layout);
                                }}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </LayoutContainer>
    );
}
