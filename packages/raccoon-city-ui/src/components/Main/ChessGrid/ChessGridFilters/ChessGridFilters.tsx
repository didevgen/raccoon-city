import {Avatar, Paper, Slider, Tooltip} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import classNames from 'classnames';
import React, {Fragment, useEffect, useState} from 'react';
import styled from 'styled-components';
import {House} from '../../../shared/types/house.types';
import {ViewModeValues} from '../ChessGrid';
import {ChessGridHouseSelect} from './ChessGridHouseSelect';

const StyledPaper = styled(Paper)`
    width: 100%;
    margin-bottom: 16px;
    display: inline-flex;
    position: fixed;
    top: 64px;
    z-index: 1202;
    padding: 8px;
`;

const SelectContainer = styled.div`
    display: flex;
    align-items: center;
    width: 400px;
    margin: 16px;
    .HouseSelect {
        width: 100%;
    }
`;

const StyledAvatar = styled(Avatar)`
    margin: 0 4px;
    cursor: pointer;

    &.active {
        background-color: #1976d2;
        color: #fff;
    }

    &.empty {
        background-color: transparent;
        border: 1px solid #1976d2;
        color: #1976d2;

        &:hover {
            background-color: #1976d2;
            color: #fff;
            transition: all 200ms linear;
        }
    }
`;

const RoomContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const FilterItemContainer = styled.div`
    margin: 0 16px;
`;

const RangeContainer = styled(FilterItemContainer)`
    min-width: 200px;
    margin: 0 32px;
`;

const FilterTitle = styled.div`
    text-align: center;
    margin-bottom: 8px;
`;

function ValueLabelComponent(props) {
    const {children, open, value} = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

const roomFilters = [{value: 'КН'}, {value: 'П'}, {value: '1'}, {value: '2'}, {value: '3'}, {value: '4+'}];

function RoomAmountFilter({dispatch}) {
    const [selected, setSelected] = useState({});

    return (
        <FilterItemContainer>
            <FilterTitle>Количество комнат</FilterTitle>
            <RoomContainer>
                {roomFilters.map((item) => {
                    const filterSelected = selected[item.value];
                    const avatarClasses = classNames({
                        active: filterSelected,
                        empty: !filterSelected
                    });
                    return (
                        <StyledAvatar
                            key={item.value}
                            className={avatarClasses}
                            onClick={() => {
                                const copy = {...selected};
                                copy[item.value] = !copy[item.value];
                                setSelected(copy);
                                dispatch({
                                    type: 'roomAmount',
                                    payload: copy
                                });
                            }}
                        >
                            {item.value}
                        </StyledAvatar>
                    );
                })}
            </RoomContainer>
        </FilterItemContainer>
    );
}

function PriceFilter({minPrice, maxPrice, dispatch}) {
    useEffect(() => {
        dispatch({
            type: 'price',
            payload: {
                minPrice,
                maxPrice
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <RangeContainer>
            <FilterTitle>Стоимость</FilterTitle>
            <Slider
                defaultValue={[minPrice, maxPrice]}
                ValueLabelComponent={ValueLabelComponent}
                aria-labelledby="discrete-slider-custom"
                step={10}
                min={minPrice}
                max={maxPrice}
                valueLabelDisplay="auto"
                onChangeCommitted={(e, value) => {
                    const [minPriceRes, maxPriceRes] = Array.isArray(value) ? value : [];
                    dispatch({
                        type: 'price',
                        payload: {
                            minPrice: minPriceRes,
                            maxPrice: maxPriceRes
                        }
                    });
                }}
                marks={[
                    {
                        value: minPrice,
                        label: `${minPrice} грн`
                    },
                    {
                        value: maxPrice,
                        label: `${maxPrice} грн`
                    }
                ]}
            />
        </RangeContainer>
    );
}

function AreaFilter({maxArea, minArea, dispatch}) {
    useEffect(() => {
        dispatch({
            type: 'area',
            payload: {
                minArea,
                maxArea
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <RangeContainer>
            <FilterTitle>Площадь</FilterTitle>
            <Slider
                defaultValue={[minArea, maxArea]}
                ValueLabelComponent={ValueLabelComponent}
                aria-labelledby="discrete-slider-custom"
                step={10}
                min={minArea}
                max={maxArea}
                valueLabelDisplay="auto"
                onChangeCommitted={(e, value) => {
                    const [minAreaRes, maxAreaRes] = Array.isArray(value) ? value : [];
                    dispatch({
                        type: 'area',
                        payload: {
                            minArea: minAreaRes,
                            maxArea: maxAreaRes
                        }
                    });
                }}
                marks={[
                    {
                        value: minArea,
                        label: `${minArea} м²`
                    },
                    {
                        value: maxArea,
                        label: `${maxArea} м²`
                    }
                ]}
            />
        </RangeContainer>
    );
}

function ViewMode({dispatch}) {
    const initialView = 'area';
    const [selected, setSelected] = useState(initialView);

    const isSelected = (value) => {
        return {
            active: selected === value,
            empty: selected !== value
        };
    };
    return (
        <FilterItemContainer>
            <FilterTitle>Режим просмотра</FilterTitle>
            <RoomContainer>
                <StyledAvatar
                    className={classNames({...isSelected(ViewModeValues.ROOM)})}
                    onClick={() => {
                        setSelected(ViewModeValues.ROOM);
                        dispatch({
                            type: 'mode',
                            payload: ViewModeValues.ROOM
                        });
                    }}
                >
                    <HomeIcon />
                </StyledAvatar>
                <StyledAvatar
                    className={classNames({...isSelected(ViewModeValues.AREA)})}
                    onClick={() => {
                        setSelected(ViewModeValues.AREA);
                        dispatch({
                            type: 'mode',
                            payload: ViewModeValues.AREA
                        });
                    }}
                >
                    М²
                </StyledAvatar>
            </RoomContainer>
        </FilterItemContainer>
    );
}

interface ChessGridFiltersProps {
    dispatchFn: (param: {type: string; payload: any}) => void;
    onHouseChange?: (house: House) => void;
    data: any;
}

export function EmptyChessGridFilters({onHouseChange}) {
    return (
        <StyledPaper elevation={3}>
            <SelectContainer>
                <ChessGridHouseSelect onChange={onHouseChange} />
            </SelectContainer>
        </StyledPaper>
    );
}

export function ChessGridFilters(props: ChessGridFiltersProps) {
    const data = props?.data?.getGroupedFlatsBySection;

    return (
        <StyledPaper elevation={3}>
            {props.onHouseChange && (
                <SelectContainer>
                    <ChessGridHouseSelect onChange={props.onHouseChange} />
                </SelectContainer>
            )}
            <RoomAmountFilter dispatch={props.dispatchFn} />
            {data && data?.groupedFlats?.length > 0 && (
                <Fragment>
                    <PriceFilter maxPrice={data.maxPrice} minPrice={data.minPrice} dispatch={props.dispatchFn} />
                    <AreaFilter maxArea={data.maxArea} minArea={data.minArea} dispatch={props.dispatchFn} />
                </Fragment>
            )}
            <ViewMode dispatch={props.dispatchFn} />
        </StyledPaper>
    );
}
