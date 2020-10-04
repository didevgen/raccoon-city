import React from 'react';
import {FlatLabelContainer, RoomAmount, Area} from './ChessFloorView.styled';
import {FlatStatus} from '../../../shared/types/flat.types';

interface FlatLabelProps {
    flatNumber?: string;
    price?: number;
    area?: number;
    squarePrice?: number;
    status?: FlatStatus;
    roomAmount?: string;
    isActive?: boolean;
}

export const FlatLabel = (props: FlatLabelProps) => {
    const {roomAmount, area, status} = props;
    return (
        <FlatLabelContainer status={status}>
            <RoomAmount status={status}>{roomAmount}</RoomAmount>
            <Area status={status}>{area}</Area>
        </FlatLabelContainer>
    );
};
