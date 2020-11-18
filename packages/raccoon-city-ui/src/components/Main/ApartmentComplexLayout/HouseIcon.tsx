import React, {useCallback} from 'react';
import {useLocation, useParams} from 'react-router';
import {GET_PUBLIC_FLATS_LIST} from '../../../graphql/queries/houseQuery';
import {useQuery} from '@apollo/react-hooks';
import {HouseIconContainer, StyledIcon, HouseNameDiv} from './styledComponents';

function houseNameSplitter(houseName: string) {
    const partArr = houseName.split(' ');
    return (
        <>
            <div>
                {partArr[0]} {partArr[1]}
            </div>
            <div>{partArr.splice(2, partArr.length - 2).join(' ')}</div>
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

    let iconsColor;
    if (!loading) {
        if (!data.getPublicFlatsList.length) {
            iconsColor = 'icon-empty';
        } else {
            data.getPublicFlatsList.find((flat) => flat.status === 'RESERVED' || flat.status === 'FREE')
                ? (iconsColor = 'icon-free')
                : (iconsColor = 'icon-sold_out');
        }
    }

    return (
        <HouseIconContainer
            className={hoveredItem?.id === house?.id ? 'active' : ''}
            onClick={() => {
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
            <StyledIcon fontSize="large" className={iconsColor} />
            <HouseNameDiv>{houseNameSplitter(house.name)}</HouseNameDiv>
        </HouseIconContainer>
    );
}

export default HouseIcon;
