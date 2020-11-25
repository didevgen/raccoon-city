import {useQuery} from '@apollo/react-hooks';
import Skeleton from '@material-ui/lab/Skeleton';
import React, {useCallback} from 'react';
import {useLocation, useParams} from 'react-router';
import {GET_PUBLIC_FLATS_LIST} from '../../../graphql/queries/houseQuery';
import {HouseIconContainer, HouseNameDiv, StyledIcon} from './styledComponents';

function houseNameSplitter(houseName: string) {
    const [firstNameItem, secondNameItem, ...restName] = houseName.split(' ');

    return (
        <>
            <div>
                {firstNameItem} {secondNameItem}
            </div>
            <div>{restName.join(' ')}</div>
        </>
    );
}

function debounce(fn, interval) {
    let timer;

    return function debounced(...args) {
        clearTimeout(timer);

        // @ts-ignore
        const that = this;

        timer = setTimeout(function callOriginalFn() {
            fn.apply(that, args);
        }, interval);
    };
}

function HouseIcon({house, setHoveredItem, hoveredItem}) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const authToken = params.get('authToken');
    const {apartmentComplexUuid, developerUuid} = useParams() as any;
    const handler = useCallback(debounce(setHoveredItem, 100), []);

    const {data, loading} = useQuery(GET_PUBLIC_FLATS_LIST, {
        variables: {
            uuid: house.id
        }
    });

    if (loading) {
        return <Skeleton variant="rect" width={40} height={40} />;
    }

    const availableFlatStatuses = ['FREE', 'BOOKED', 'RESERVED'];

    const houseHasFlats = data.getPublicFlatsList.length;
    const isFlatFreeOrReserved = data.getPublicFlatsList.find(({status}) => availableFlatStatuses.includes(status));
    const houseHasFreeFlats = isFlatFreeOrReserved;

    let iconColor: string;
    if (!houseHasFlats) {
        iconColor = 'icon-empty';
    } else {
        houseHasFreeFlats ? (iconColor = 'icon-free') : (iconColor = 'icon-sold_out');
    }

    return (
        <HouseIconContainer
            className={hoveredItem?.id === house?.id ? 'active' : ''}
            onClick={() => {
                if (!houseHasFlats) {
                    return;
                }

                // @ts-ignore
                if (window.location !== window.parent.location) {
                    // @ts-ignore
                    window.parent.postMessage(
                        `${process.env.REACT_APP_PUBLIC_BASE_URL}/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/houseGrid/${house.id}?authToken=${authToken}`,
                        '*'
                    );
                } else {
                    window.open(
                        `${process.env.REACT_APP_PUBLIC_BASE_URL}/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/houseGrid/${house.id}?authToken=${authToken}`,
                        '_blank'
                    );
                }
            }}
            onMouseEnter={() => handler(house)}
            onMouseLeave={() => handler(null)}
        >
            <StyledIcon fontSize="large" className={iconColor} />
            <HouseNameDiv>{houseNameSplitter(house.name)}</HouseNameDiv>
        </HouseIconContainer>
    );
}

export default HouseIcon;
