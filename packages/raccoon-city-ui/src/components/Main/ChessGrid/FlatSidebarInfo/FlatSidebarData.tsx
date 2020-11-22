import {useMutation} from '@apollo/react-hooks';
import {MenuItem, Select} from '@material-ui/core';
import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import {FLAT_STATUSES} from '../../../../core/constants';
import {UPDATE_FLAT_STATUS} from '../../../../graphql/mutations/flatMutation';
import {GET_FLAT_LIST, GET_GROUPED_FLATS_CHESSGRID} from '../../../../graphql/queries/houseQuery';
import {GET_FLATS_INFO_WITH_SVG_LAYOUTS} from '../../../../graphql/queries/layoutQuery';
import {Flat} from '../../../shared/types/flat.types';
import {ChessCellViewMode} from '../ChessEnums';

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
    if (!value) {
        return null;
    }

    return (
        <FlatInfoLine>
            <div className="FlatInfoItem__label">{label}</div>
            <div>{value}</div>
        </FlatInfoLine>
    );
}

interface FlatSidebarDataProps {
    flat: Flat;
    houseId: string;
    viewMode: ChessCellViewMode;
    currentLevel?: string;
    setSavedFlat: any;
    isPublic: boolean;
}

function FlatPriceInfoItem({flat}) {
    if (!flat.squarePrice) {
        return null;
    }

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
    const {flat, houseId, viewMode, currentLevel, setSavedFlat, isPublic} = props;
    const [updateFlatStatus] = useMutation(UPDATE_FLAT_STATUS);
    const flatStatus = FLAT_STATUSES.find((statuses) => statuses.value === flat.status);
    const [status, setStatus] = useState(flatStatus?.label);

    const QUERY = {
        [ChessCellViewMode.TILE_PLUS]: {
            query: GET_GROUPED_FLATS_CHESSGRID,
            variables: {
                uuid: houseId
            }
        },
        [ChessCellViewMode.TILE]: {
            query: GET_GROUPED_FLATS_CHESSGRID,
            variables: {
                uuid: houseId
            }
        },
        [ChessCellViewMode.LIST]: {
            query: GET_FLAT_LIST,
            variables: {}
        },
        [ChessCellViewMode.FLOOR]: {
            query: GET_FLATS_INFO_WITH_SVG_LAYOUTS,
            variables: {
                levelId: currentLevel
            }
        }
    };

    const handleFlatStatusChange = (label: string) => {
        setStatus(label);

        const savedFlat = {
            section: flat.section,
            level: flat.level,
            flatNumber: flat.flatNumber
        };

        setSavedFlat(savedFlat);
    };

    return (
        <div>
            <FlatInfoItem label="Номер квартиры" value={flat.flatNumber} />
            {!!flat.price && <FlatInfoItem label="Цена" value={<FlatPriceInfoItem flat={flat} />} />}
            <FlatInfoItem label="Цена м2" value={flat.squarePriceSale || flat.squarePrice} />
            <FlatInfoItem label="Этаж" value={flat.level} />
            <FlatInfoItem label="Количество уровней" value={flat.levelAmount} />
            <FlatInfoItem label="Подъезд" value={flat.section} />
            <FlatInfoItem label="Количество комнат" value={flat.roomAmount} />
            <FlatInfoItem label="Площадь" value={flat.area} />
            {isPublic ? (
                <FlatInfoItem label="Статус" value={FLAT_STATUSES.find(({value}) => flat.status === value)?.label} />
            ) : (
                <FlatInfoItem
                    label="Статус"
                    value={
                        <Select value={status}>
                            {FLAT_STATUSES.map((item) => {
                                return (
                                    <MenuItem
                                        key={item.label}
                                        value={item.label}
                                        onClick={async () => {
                                            handleFlatStatusChange(item.label);
                                            await updateFlatStatus({
                                                variables: {
                                                    flatId: flat.id,
                                                    flatStatus: item.value
                                                },
                                                refetchQueries: [
                                                    {
                                                        query: QUERY[viewMode].query,
                                                        variables: {
                                                            ...QUERY[viewMode].variables
                                                        }
                                                    }
                                                ]
                                            });
                                        }}
                                    >
                                        {item.label}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    }
                />
            )}
        </div>
    );
}
