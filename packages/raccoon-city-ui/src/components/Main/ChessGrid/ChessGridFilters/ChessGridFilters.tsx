import {Avatar, Grid, Paper, Slider, Tooltip} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {House} from '../../../shared/types/house.types';
import {ViewModeValues} from '../ChessGrid';
import {ChessGridHouseSelect} from './ChessGridHouseSelect';

const StyledPaper = styled(Paper)`
    width: 100%;
    display: inline-flex;
    position: sticky;
    top: 64px;
    z-index: 1202;
    padding: 8px;
`;

const SelectContainer = styled.div`
    display: flex;
    align-items: center;
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
    width: 140px;
    margin: 0 48px;
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

function PriceFilter({minPrice, maxPrice, dispatch, data}) {
    const [min, setMin] = useState(minPrice);
    const [max, setMax] = useState(maxPrice);
    useEffect(() => {
        dispatch({
            type: 'price',
            payload: {
                minPrice,
                maxPrice
            }
        });

        setMin(minPrice);
        setMax(maxPrice);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPrice, maxPrice, data]);
    return (
        <RangeContainer>
            <FilterTitle>Стоимость</FilterTitle>
            <Slider
                value={[min, max]}
                ValueLabelComponent={ValueLabelComponent}
                aria-labelledby="discrete-slider-custom"
                step={10}
                min={minPrice}
                max={maxPrice}
                valueLabelDisplay="auto"
                onChange={(e, value) => {
                    const [minPriceRes, maxPriceRes] = Array.isArray(value) ? value : [];
                    setMin(minPriceRes);
                    setMax(maxPriceRes);
                }}
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

function AreaFilter({maxArea, minArea, dispatch, data}) {
    const [min, setMin] = useState(minArea);
    const [max, setMax] = useState(maxArea);

    useEffect(() => {
        dispatch({
            type: 'area',
            payload: {
                minArea,
                maxArea
            }
        });
        setMin(minArea);
        setMax(maxArea);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxArea, minArea, data]);
    return (
        <RangeContainer>
            <FilterTitle>Площадь</FilterTitle>
            <Slider
                value={[min, max]}
                ValueLabelComponent={ValueLabelComponent}
                aria-labelledby="discrete-slider-custom"
                step={10}
                min={minArea}
                max={maxArea}
                valueLabelDisplay="auto"
                onChange={(e, value) => {
                    const [minAreaRes, maxAreaRes] = Array.isArray(value) ? value : [];
                    setMin(minAreaRes);
                    setMax(maxAreaRes);
                }}
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
    const hasPrices = data && data?.groupedFlats?.length > 0;
    return (
        <StyledPaper elevation={3}>
            <Grid container spacing={1}>
                {props.onHouseChange && (
                    <Grid item xs={hasPrices ? 6 : 4} lg={hasPrices ? 3 : 3} xl={3}>
                        <SelectContainer>
                            <ChessGridHouseSelect onChange={props.onHouseChange} />
                        </SelectContainer>
                    </Grid>
                )}
                <Grid item xs={hasPrices ? 6 : 4} lg={hasPrices ? 3 : 3} xl={hasPrices ? 3 : 4}>
                    <Grid container justify="center">
                        <RoomAmountFilter dispatch={props.dispatchFn} />
                    </Grid>
                </Grid>
                <Grid item xs={hasPrices ? 3 : 4} lg={hasPrices ? 2 : 2} xl={hasPrices ? 2 : 3}>
                    <Grid container justify="center">
                        <ViewMode dispatch={props.dispatchFn} />
                    </Grid>
                </Grid>
                {hasPrices && (
                    <Grid item xs={9} lg={4} xl={4}>
                        <Grid container justify="center" direction="row">
                            <PriceFilter
                                data={data}
                                maxPrice={data.maxPrice}
                                minPrice={data.minPrice}
                                dispatch={props.dispatchFn}
                            />
                            <AreaFilter
                                maxArea={data.maxArea}
                                minArea={data.minArea}
                                dispatch={props.dispatchFn}
                                data={data}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </StyledPaper>
    );
}
