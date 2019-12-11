import * as React from 'react';
import {ParsedFlat} from '../../../../shared/types/flat.types';
import {useQuery} from '@apollo/react-hooks';
import {House} from '../../../../shared/types/house.types';
import {HOUSE_LIST} from '../../../../../graphql/queries/houseQuery';

interface ParsedHouse {
    house: string;
    flats: ParsedFlat[];
}

interface HouseMatchProps {
    data: ParsedHouse[];
    apartmentComplexUuid: string;
}

export function HouseMatch(props: HouseMatchProps) {
    console.log(props.data);
    const {loading, error, data} = useQuery<{getHouses: House[]}>(HOUSE_LIST, {
        variables: {
            apartmentComplexId: props.apartmentComplexUuid
        }
    });

    if (error || loading || !data) {
        return null;
    }

    console.log(data.getHouses);
    return <h1>Hello</h1>;
}
