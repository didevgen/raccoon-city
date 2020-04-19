import {useQuery} from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {useParams} from 'react-router';
import {GET_LAYOUTS} from '../../../../graphql/queries/layoutQuery';
import {HouseLayout} from '../../../shared/types/layout.types';
import {FlatLayoutCard} from '../FlatLayoutCard/FlatLayoutCard';

export function FlatLayoutList() {
    const {houseUuid} = useParams();
    const {loading, error, data} = useQuery(GET_LAYOUTS, {
        variables: {
            houseId: houseUuid
        }
    });

    if (loading || error) {
        return null;
    }

    return data.getFlatLayouts.map((layout: HouseLayout) => {
        return (
            <Grid item={true} xs={12} md={3} key={layout.id}>
                <FlatLayoutCard name={layout.name} id={layout.id} imageUrl={layout.image.previewImageUrl} />
            </Grid>
        );
    });
}
