import ApartmentIcon from '@material-ui/icons/Apartment';
import React, {useCallback} from 'react';
import {useLocation, useParams} from 'react-router';
import styled from 'styled-components';

const HouseIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    &:hover,
    &.active {
        color: #e84f1d !important;
        cursor: pointer;
    }
`;

const HouseNameDiv = styled.div`
    font-size: 1.5vw;
`;

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
    return (
        <HouseIconContainer
            className={hoveredItem?.id === house?.id ? 'active' : ''}
            onClick={() => {
                console.log('asd');
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
            <ApartmentIcon fontSize="large" />
            <HouseNameDiv>{house.name}</HouseNameDiv>
        </HouseIconContainer>
    );
}

export default HouseIcon;
