import React from 'react';
import styled from 'styled-components';
import {FLAT_STATUSES} from '../../../../core/constants';
import {Flat} from '../../../shared/types/flat.types';

const FlatSidebarWrapper = styled.div`
    padding: 16px;
    width: 420px;
`;

const ImageContainer = styled.div`
    max-width: 420px;
    .FlatSidebarInfo__image {
        width: 100%;
    }
`;

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

interface FlatSidebarInfoProps {
    flat: Flat;
}

function FlatInfoItem({label, value}: any) {
    return (
        <FlatInfoLine>
            <div className="FlatInfoItem__label">{label}</div>
            <div>{value}</div>
        </FlatInfoLine>
    );
}

export function FlatSidebarInfo(props: FlatSidebarInfoProps) {
    const {flat} = props;
    const flatStatus = FLAT_STATUSES.find((statuses) => statuses.value === flat.status);
    return (
        <FlatSidebarWrapper>
            {flat.layout && (
                <ImageContainer>
                    <img
                        className="FlatSidebarInfo__image"
                        src={flat.layout?.image.previewImageUrl}
                        alt={flat.layout?.name}
                    />
                </ImageContainer>
            )}
            <div>
                <FlatInfoItem label="Номер квартиры" value={flat.flatNumber} />
                <FlatInfoItem label="Цена" value={flat.price} />
                <FlatInfoItem label="Этаж" value={flat.level} />
                <FlatInfoItem label="Подъезд" value={flat.section} />
                <FlatInfoItem label="Количество комнат" value={flat.roomAmount} />
                <FlatInfoItem label="Площадь" value={flat.area} />
                <FlatInfoItem label="Статус" value={flatStatus?.label} />
            </div>
        </FlatSidebarWrapper>
    );
}
