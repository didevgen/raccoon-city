import React from 'react';
import {FloorLegendItem} from '../ChessFloorView.styled';
import styled from 'styled-components';

const FlatStatusesBarContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 35px 10px;
    margin-bottom: 20px;

    @media only screen and (max-width: 500px) {
        flex-direction: column;
    }
`;

export const FlatStatusesBar = () => (
    <FlatStatusesBarContainer>
        <FloorLegendItem color="#4caf50">
            <div></div>
            <span>Свободно</span>
        </FloorLegendItem>
        <FloorLegendItem color="#ffeb3b">
            <div></div>
            <span>Резерв / Забронировано</span>
        </FloorLegendItem>
        <FloorLegendItem color="#f44336">
            <div></div>
            <span>Продано</span>
        </FloorLegendItem>
        <FloorLegendItem color="#00bcd4">
            <div></div>
            <span>Оформление документов</span>
        </FloorLegendItem>
        <FloorLegendItem color="#9e9e9e">
            <div></div>
            <span>Недоступно</span>
        </FloorLegendItem>
    </FlatStatusesBarContainer>
);
