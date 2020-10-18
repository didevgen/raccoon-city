import styled from 'styled-components';
import {FlatStatus} from '../../../shared/types/flat.types';
import {Select} from '@material-ui/core';

export const FloorViewContainer = styled.div`
    margin-top: 10px;
    min-height: 75vh;
    border-radius: 4px;
    overflow: hidden;
`;

export const FloorsListContainer = styled.div`
    width: 10%;
    max-height: 70vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    @media only screen and (max-width: 500px) {
        display: none;
    }
`;

export const FloorsListItem = styled.p<{isPublic: boolean}>`
    width: 100%;
    padding: 5px 0px;
    text-align: center;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
        color: ${({isPublic}) => (isPublic ? '#E84F1D' : '#3f51b5')};
    }
`;

export const FloorContentContainer = styled.div`
    width: 87%;
    padding: 10px;
    position: relative;

    img {
        width: 100%;
    }

    @media only screen and (max-width: 500px) {
        display: flex;
        flex-direction: column;
    }
`;

export const FloorLegendInfo = styled.div`
    display: flex;
    padding: 10px 35px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    justify-content: space-between;

    @media only screen and (max-width: 500px) {
        flex-direction: column;
        padding: 10px 0;
    }
`;

export const FloorLegendItem = styled.div<{color: string}>`
    margin-right: 20px;
    display: flex;
    align-items: center;

    span {
        color: #a6a6a6;
        font-weight: 600;
        padding-left: 5px;
    }

    div {
        width: 15px;
        height: 15px;
        background-color: ${({color}) => color};
        border-radius: 3px;
    }
`;

const Colors = {
    [FlatStatus.FREE]: {
        main: '#4caf50',
        second: '#66bb6a',
        border: '#345e35'
    },
    [FlatStatus.SOLD_OUT]: {
        main: '#f44336',
        second: '#e57373',
        border: '#822b24'
    },
    [FlatStatus.UNAVAILABLE]: {
        main: '#9e9e9e',
        second: '#bdbdbd',
        border: '#575757'
    },
    [FlatStatus.DOCUMENTS_IN_PROGRESS]: {
        main: '#00bcd4',
        second: '#26c6da',
        border: '#016f7d'
    },
    [FlatStatus.RESERVED]: {
        main: '#ffeb3b',
        second: '#fff176',
        border: '#918621'
    },
    [FlatStatus.BOOKED]: {
        main: '#ffeb3b',
        second: '#fff176',
        border: '#918621'
    }
};

export const getBorderColor = (props) => {
    const {status} = props;
    const borderColor = Colors[status].border;

    return `${borderColor} ${borderColor} transparent transparent`;
};

export const getRoomAmountBackground = (props) => {
    const {status} = props;

    return Colors[status].main;
};

export const getAreaBackground = (props) => {
    const {status} = props;

    return Colors[status].second;
};

export const FlatLabelContainer = styled.div<any>`
    display: inline-flex;
    width: 95px;
    text-align: center;
    border-radius: 2px;
    position: relative;
    z-index: 10;

    &::before {
        content: '';
        display: block;
        width: 0px;
        height: 0px;
        position: absolute;
        top: 100%;
        left: 0px;
        border-style: solid;
        border-width: 3px;
        border-color: ${getBorderColor};
    }
`;

export const RoomAmount = styled.div<any>`
    width: 20%;
    background-color: ${getRoomAmountBackground};
    color: #fff;
`;

export const Area = styled.div<any>`
    width: 80%;
    background-color: ${getAreaBackground};
`;

export const FlatInfo = styled.div`
    padding: 5px 10px;
    border-radius: 10px;
    background-color: transparent;
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 60%;
    min-width: 60%;
    border: 1px solid #000;

    span {
        font-size: 15px;
    }

    @media only screen and (max-width: 500px) {
        display: none;
    }
`;

export const LevelSelectMobile = styled.div`
    display: none;
    width: 100%;

    @media only screen and (max-width: 500px) {
        display: block;
    }
`;

export const CustomSelect = styled(Select)<{isPublic: boolean}>`
    min-width: 100%;
    border: 2px solid ${({isPublic}) => (isPublic ? '#e84f1d' : '#3f51b5')};
    border-radius: 10px;
`;

export const SelectWrapper = styled.div<{isPublic: boolean}>`
    margin: 5px 0;

    .MuiSelect-root {
        padding: 5px 10px;
    }

    .MuiInput-underline::after {
        content: none !important;
        border-bottom: none !important;
    }

    .MuiInput-underline::before {
        content: none !important;
        border-bottom: none !important;
    }

    svg {
        fill: ${({isPublic}) => (isPublic ? '#e84f1d' : '#3f51b5')};
    }
`;

export const WarningContainer: any = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4em;
    text-align: center;
`;

export const WarningContainerColumn = styled(WarningContainer)`
    flex-direction: column;
`;

export const FloorContainer = styled.div`
    display: flex;
`;
