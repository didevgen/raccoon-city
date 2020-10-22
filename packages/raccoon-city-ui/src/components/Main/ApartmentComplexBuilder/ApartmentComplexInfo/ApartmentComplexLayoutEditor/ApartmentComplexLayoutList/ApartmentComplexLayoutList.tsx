import {useQuery} from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {useParams} from 'react-router';
import {GET_APARTMENT_COMPLEX_LAYOUTS} from '../../../../../../graphql/queries/layoutQuery';
import {CardSkeleton} from '../../../../../shared/components/skeletons/CardSkeleton';
import {ApartmentComplexLayout} from '../../../../../shared/types/layout.types';
import {ApartmentComplexLayoutCard} from '../ApartmentComplexLayoutCard/ApartmentComplexLayoutCard';

export function ApartmentComplexLayoutList() {
    const {apartmentComplexUuid} = useParams();
    const {loading, error, data} = useQuery(GET_APARTMENT_COMPLEX_LAYOUTS, {
        variables: {
            uuid: apartmentComplexUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return <CardSkeleton />;
    }

    if (error) {
        return null;
    }

    return data.getApartmentComplexLayouts.map((layout: ApartmentComplexLayout) => {
        return (
            <Grid item={true} xs={12} md={3} key={layout.id}>
                <Grid container justify="center">
                    <ApartmentComplexLayoutCard
                        layout={layout}
                        name={layout.name}
                        id={layout.id}
                        previewImage={layout.image.previewImageUrl}
                        imageUrl={layout.image.downloadUrl}
                    />
                </Grid>
            </Grid>
        );
    });
}
