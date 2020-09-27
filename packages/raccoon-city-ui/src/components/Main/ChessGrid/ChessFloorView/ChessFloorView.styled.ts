import styled from 'styled-components';
import {FlatStatus} from '../../../shared/types/flat.types';

export const FloorViewContainer = styled.div`
    margin-top: 10px;
    min-height: 75vh;
    background-color: #fff;
    box-shadow: 1px 1px 10px rgba(1, 1, 1, 0.4);
    border-radius: 4px;
    overflow: hidden;
`;

export const FloorsListContainer = styled.div`
    width: 13%;
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
`;

export const FloorsListItem = styled.p`
    width: 100%;
    padding: 5px 0px;
    text-align: center;
    transition: 0.3s;
    border-bottom: 2px solid #fff;
    cursor: pointer;

    &:hover {
        color: #3f51b5;
        border-bottom-color: #3f51b5;
    }
`;

export const FloorContentContainer = styled.div`
    width: 87%;
    padding: 50px;
`;

export const FloorLegendInfo = styled.div`
    display: flex;
    padding: 10px 35px 10px;
    margin-bottom: 10px;
    background-color: #f5f5f5;
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
