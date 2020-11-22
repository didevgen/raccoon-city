import React from 'react';
import {FLAT_STATUSES} from '../../../../../core/constants';
import {FlatInfo} from '../ChessFloorView.styled';

interface Props {
    info: any;
}

export const FlatInfoBar = ({info}: Props) => (
    <FlatInfo>
        {info ? (
            <>
                <span>{`№${info.flatNumber}`}</span>
                <span>{`Статус: ${FLAT_STATUSES.find((statuses) => statuses.value === info.status)?.label}`}</span>
                {info.status !== 'SOLD_OUT' && info.price && <span>{`Цена: ${info.price}`}</span>}
                <span>{`М2: ${info.area}`}</span>
                {(info.squarePriceSale || info.squarePrice) && (
                    <span>{`Цена м2: ${info.squarePriceSale || info.squarePrice}`}</span>
                )}
                <span>{`Комнат: ${info.roomAmount}`}</span>
                <span>{`Кол-во уровней: ${info.levelAmount}`}</span>
            </>
        ) : (
            <span>Выберите квартиру</span>
        )}
    </FlatInfo>
);
