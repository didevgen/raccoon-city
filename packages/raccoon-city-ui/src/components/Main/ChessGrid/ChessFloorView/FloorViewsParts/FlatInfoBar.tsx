import React from 'react';
import {FlatInfo} from '../ChessFloorView.styled';
import {FLAT_STATUSES} from '../../../../../core/constants';

interface Props {
    info: any;
}

export const FlatInfoBar = ({info}: Props) => (
    <FlatInfo>
        {info ? (
            <>
                <span>{`№${info.flatNumber}`}</span>
                <span>{`Статус: ${FLAT_STATUSES.find((statuses) => statuses.value === info.status)?.label}`}</span>
                <span>{`Цена: ${info.price}`}</span>
                <span>{`М2: ${info.area}`}</span>
                <span>{`Цена м2: ${info.squarePrice}`}</span>
                <span>{`Комнат: ${info.roomAmount}`}</span>
                <span>{`Кол-во уровней: ${info.levelAmount}`}</span>
            </>
        ) : (
            <span>Выберите квартиру</span>
        )}
    </FlatInfo>
);
