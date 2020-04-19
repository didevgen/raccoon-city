import React from 'react';
import styled from 'styled-components';
import {FLAT_STATUSES} from '../../../../core/constants';
import {Flat} from '../../../shared/types/flat.types';

const FlatInfoLine = styled.div`
    display: flex;
    justify-content: space-between;
    .FlatInfoItem__label {
        font-weight: 500;
    }
    padding-bottom: 8px;
    padding-top: 8px;
    border-bottom: 1px solid #000;
`;

function FlatInfoItem({label, value}: any) {
    return (
        <FlatInfoLine>
            <div className="FlatInfoItem__label">{label}</div>
            <div>{value}</div>
        </FlatInfoLine>
    );
}

interface FlatSidebarDataProps {
    flat: Flat;
}

export function FlatSidebarData(props: FlatSidebarDataProps) {
    const {flat} = props;
    const flatStatus = FLAT_STATUSES.find((statuses) => statuses.value === flat.status);
    return (
        <div>
            <FlatInfoItem label="Номер квартиры" value={flat.flatNumber} />
            <FlatInfoItem label="Цена" value={flat.price} />
            <FlatInfoItem label="Цена м2" value={flat.squarePrice} />
            <FlatInfoItem label="Этаж" value={flat.level} />
            <FlatInfoItem label="Подъезд" value={flat.section} />
            <FlatInfoItem label="Количество комнат" value={flat.roomAmount} />
            <FlatInfoItem label="Площадь" value={flat.area} />
            <FlatInfoItem label="Статус" value={flatStatus?.label} />
        </div>
    );
}
