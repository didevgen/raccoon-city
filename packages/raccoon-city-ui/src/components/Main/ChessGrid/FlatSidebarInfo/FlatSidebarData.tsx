import React, {Fragment} from 'react';
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

const FlatPrice = styled.span`
    text-decoration: line-through;
`;

const FlatSale = styled.span`
    margin-left: 8px;
    font-weight: bold;
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

function FlatPriceInfoItem({flat}) {
    const price = flat.area * flat.squarePrice;
    const salePrice = flat.area * (flat.squarePriceSale || -1);

    if (salePrice < 0) {
        return <span>{price.toFixed(2)}</span>;
    }

    return (
        <Fragment>
            <FlatPrice>{price.toFixed(2)}</FlatPrice>
            <FlatSale>{salePrice.toFixed(2)}</FlatSale>
        </Fragment>
    );
}

export function FlatSidebarData(props: FlatSidebarDataProps) {
    const {flat} = props;
    const flatStatus = FLAT_STATUSES.find((statuses) => statuses.value === flat.status);
    return (
        <div>
            <FlatInfoItem label="Номер квартиры" value={flat.flatNumber} />
            <FlatInfoItem label="Цена" value={<FlatPriceInfoItem flat={flat} />} />
            <FlatInfoItem label="Цена м2" value={flat.squarePriceSale || flat.squarePrice} />
            <FlatInfoItem label="Этаж" value={flat.level} />
            <FlatInfoItem label="Количество уровней" value={flat.levelAmount} />
            <FlatInfoItem label="Подъезд" value={flat.section} />
            <FlatInfoItem label="Количество комнат" value={flat.roomAmount} />
            <FlatInfoItem label="Площадь" value={flat.area} />
            <FlatInfoItem label="Статус" value={flatStatus?.label} />
        </div>
    );
}
