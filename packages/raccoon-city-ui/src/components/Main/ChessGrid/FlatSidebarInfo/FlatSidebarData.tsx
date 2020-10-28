import React, {Fragment, useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {MenuItem, Select} from '@material-ui/core';
import styled from 'styled-components';
import {FLAT_STATUSES} from '../../../../core/constants';
import {Flat} from '../../../shared/types/flat.types';
import {UPDATE_FLAT_STATUS} from '../../../../graphql/mutations/flatMutation';
import {GET_FLAT_LIST, GET_GROUPED_FLATS_CHESSGRID} from '../../../../graphql/queries/houseQuery';
import {ChessCellViewMode} from '../ChessEnums';
import {GET_FLATS_INFO_WITH_SVG_LAYOUTS} from '../../../../graphql/queries/layoutQuery';

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
    houseId: string;
    viewMode: ChessCellViewMode;
    currentLevel?: string;
    setSavedFlat: any;
}

export function FlatSidebarData(props: FlatSidebarDataProps) {
    const {flat, houseId, viewMode, currentLevel, setSavedFlat} = props;
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
            <FlatInfoItem
                label="Цена"
                value={
                    flat.sale ? (
                        <Fragment>
                            <FlatPrice>{flat.price}</FlatPrice>
                            <FlatSale>{flat.sale}</FlatSale>
                        </Fragment>
                    ) : (
                        flat.price
                    )
                }
            />
            <FlatInfoItem label="Цена м2" value={flat.squarePrice} />
            <FlatInfoItem label="Этаж" value={flat.level} />
            <FlatInfoItem label="Количество уровней" value={flat.levelAmount} />
            <FlatInfoItem label="Подъезд" value={flat.section} />
            <FlatInfoItem label="Количество комнат" value={flat.roomAmount} />
            <FlatInfoItem label="Площадь" value={flat.area} />
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
        </div>
    );
}
