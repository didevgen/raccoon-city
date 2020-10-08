import React, {Fragment} from 'react';
import {FloorLegendItem} from '../ChessFloorView.styled';

export const FlatStatusesBar = () => (
    <Fragment>
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
    </Fragment>
);
