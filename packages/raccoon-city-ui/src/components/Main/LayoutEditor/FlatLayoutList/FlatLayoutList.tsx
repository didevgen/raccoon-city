import {useQuery} from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {useParams} from 'react-router';
import {GET_LAYOUTS} from '../../../../graphql/queries/layoutQuery';
import {CardSkeleton} from '../../../shared/components/skeletons/CardSkeleton';
import {HouseLayout} from '../../../shared/types/layout.types';
import {FlatLayoutCard} from '../FlatLayoutCard/FlatLayoutCard';

export function FlatLayoutList() {
    const {houseUuid} = useParams();
    const {loading, error, data} = useQuery(GET_LAYOUTS, {
        variables: {
            houseId: houseUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return <CardSkeleton />;
    }

    if (error) {
        return null;
    }

    return data.getFlatLayouts.map((layout: HouseLayout) => {
        if (!layout.image) {
            return <div>Загрузите изображания</div>;
        }

        return (
            <Grid item={true} xs={12} md={4} key={layout.id}>
                <Grid container justify="center">
                    <FlatLayoutCard name={layout.name} id={layout.id} imageUrl={layout.image.previewImageUrl} />
                </Grid>
            </Grid>
        );
    });
}
