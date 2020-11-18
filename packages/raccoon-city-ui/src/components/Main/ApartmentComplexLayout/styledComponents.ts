import styled from 'styled-components';
import {SVG} from '@svgdotjs/svg.js';
import ApartmentIcon from '@material-ui/icons/Apartment';
import Carousel from 'react-elastic-carousel';

// common container
export const LayoutContainer = styled.div`
    height: 100vh;
`;

// carousel container
export const HouseChooseContainer = styled.div`
    height: 15vh;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
`;

// complex layout container
export const ImageContainer = styled.div`
    display: flex;
    height: 80%;
`;

// complex scg container
export function attachSvg(container: string) {
    return SVG()
        .addTo(container)
        .size('100%', '100%');
}

export const LayoutImage = styled.div<any>`
    flex: 1;
    background: url(${(props: any) => props.url}) no-repeat center;
    background-size: contain;
    height: 80%;
`;

export const StyledCarousel = styled(Carousel)`
    .rec-swipable {
        align-items: center;
    }

    .rec-dot {
        border-radius: 0;
        height: 12px;
        background-color: #c4c4c4;
        box-shadow: none;
    }

    .rec-dot_active {
        background-color: #e84f1d;
    }

    .rec-arrow {
        margin: 0 20px;
        background-color: #c4c4c4;
        color: #fff;
        font-size: 1em;
        height: 30px;
        width: 30px;
        min-width: 30px;
        line-height: 30px;
    }

    .rec-arrow:disabled:hover {
        background-color: #c4c4c4;
    }

    .rec-arrow:enabled {
        background-color: #c4c4c4;
    }

    .rec-arrow:enabled:hover {
        background-color: #e84f1d;
    }
`;

export const HouseIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    &:hover,
    &:hover svg,
    &.active,
    &.active svg {
        color: #e84f1d !important;
        cursor: pointer;
    }
`;

export const StyledIcon = styled(ApartmentIcon)`
    &.icon-empty {
        color: #808080;
    }

    &.icon-free {
        color: #008000;
    }

    &.icon-sold_out {
        color: #ff0047;
    }

    &:hover {
        color: #e84f1d !important;
    }
`;

export const HouseNameDiv = styled.div`
    font-size: 1vw;
    text-align: center;
`;
