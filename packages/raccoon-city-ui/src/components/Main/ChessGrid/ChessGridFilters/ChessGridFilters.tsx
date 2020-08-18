import {Avatar, Grid, Slider, Tooltip} from '@material-ui/core';
import Input from '@material-ui/core/Input';
import HomeIcon from '@material-ui/icons/Home';
import classNames from 'classnames';
import React, {Fragment, useEffect, useState, useContext} from 'react';
import styled from 'styled-components';
import {House} from '../../../shared/types/house.types';
import {ViewModeValues} from '../ChessGrid';
import {ChessGridHouseSelect} from './ChessGridHouseSelect';
import {CellViewModeContext} from '../ChessGrid';

const SelectContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px;
    .HouseSelect {
        width: 90%;

        @media (max-width: 889px) {
            width: 100%;
            padding: 32px 8px 8px;
        }
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

const LeftInputGrid = styled(Grid)`
    display: flex;
    justify-content: flex-end;
`;
const RangeContainer = styled(FilterItemContainer)``;

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

const RangeInput = styled(Input)``;

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
            <Grid container spacing={2} alignItems="center">
                <LeftInputGrid item xs={3}>
                    <RangeInput
                        className="LeftInput"
                        value={min}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const val = event.target.value === '' ? '' : Number(event.target.value);
                            setMin(val);
                        }}
                        onBlur={() => {
                            dispatch({
                                type: 'price',
                                payload: {
                                    minPrice: min,
                                    maxPrice: max
                                }
                            });
                        }}
                        inputProps={{
                            step: 10,
                            min: minPrice,
                            max: maxPrice,
                            type: 'number',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                </LeftInputGrid>
                <Grid item xs={6}>
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
                    />
                </Grid>
                <Grid item xs={3}>
                    <RangeInput
                        value={max}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const val = event.target.value === '' ? '' : Number(event.target.value);
                            setMax(val);
                        }}
                        onBlur={() => {
                            dispatch({
                                type: 'price',
                                payload: {
                                    minPrice: min,
                                    maxPrice: max
                                }
                            });
                        }}
                        inputProps={{
                            step: 10,
                            min: minPrice,
                            max: maxPrice,
                            type: 'number',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                </Grid>
            </Grid>
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
            <Grid container spacing={2} alignItems="center">
                <LeftInputGrid item xs={3}>
                    <RangeInput
                        className="LeftInput"
                        value={min}
                        onBlur={() => {
                            dispatch({
                                type: 'area',
                                payload: {
                                    minArea: min,
                                    maxArea: max
                                }
                            });
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const val = event.target.value === '' ? '' : Number(event.target.value);
                            setMin(val);
                        }}
                        inputProps={{
                            step: 10,
                            min: minArea,
                            max: maxArea,
                            type: 'number',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                </LeftInputGrid>
                <Grid item xs={6}>
                    <Slider
                        value={[min, max]}
                        ValueLabelComponent={ValueLabelComponent}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        min={minArea}
                        max={maxArea}
                        valueLabelDisplay="auto"
                        onChange={(e, value) => {
                            const [minPriceRes, maxPriceRes] = Array.isArray(value) ? value : [];
                            setMin(minPriceRes);
                            setMax(maxPriceRes);
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
                    />
                </Grid>
                <Grid item xs={3}>
                    <RangeInput
                        value={max}
                        onBlur={() => {
                            dispatch({
                                type: 'area',
                                payload: {
                                    minArea: min,
                                    maxArea: max
                                }
                            });
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const val = event.target.value === '' ? '' : Number(event.target.value);
                            setMax(val);
                        }}
                        inputProps={{
                            step: 10,
                            min: minArea,
                            max: maxArea,
                            type: 'number',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                </Grid>
            </Grid>
        </RangeContainer>
    );
}

function ViewMode({dispatch}) {
    const initialView = 'area';
    const [selected, setSelected] = useState(initialView);
    const cellView = useContext<any>(CellViewModeContext);

    const isSelected = (value) => {
        return {
            active: selected === value,
            empty: selected !== value
        };
    };

    if (cellView.mode !== 'tile') {
        return null;
    }

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
                <StyledAvatar
                    className={classNames({...isSelected(ViewModeValues.NUMBER)})}
                    onClick={() => {
                        setSelected(ViewModeValues.NUMBER);
                        dispatch({
                            type: 'mode',
                            payload: ViewModeValues.NUMBER
                        });
                    }}
                >
                    №
                </StyledAvatar>
            </RoomContainer>
        </FilterItemContainer>
    );
}

interface ChessGridFiltersProps {
    dispatchFn: (param: {type: string; payload: any}) => void;
    onHouseChange?: (house: House[]) => void;
    data: any;
    isPublic: boolean;
}

export function ChessGridFilters(props: ChessGridFiltersProps) {
    const data = props?.data?.getGroupedFlatsBySection;
    const hasPrices = data && data?.houseFlats?.length > 0;
    return (
        <Fragment>
            <Grid container spacing={1}>
                {props.onHouseChange && (
                    <Grid item xs={12}>
                        <SelectContainer>
                            <ChessGridHouseSelect onChange={props.onHouseChange} isPublic={props.isPublic} />
                        </SelectContainer>
                    </Grid>
                )}
                {hasPrices && (
                    <Fragment>
                        <Grid item xs={12} md={4}>
                            <Grid container justify="center">
                                <RoomAmountFilter dispatch={props.dispatchFn} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Grid container justify="center">
                                <ViewMode dispatch={props.dispatchFn} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Grid container justify="center" direction="row">
                                <Grid item xs={12} md={6}>
                                    <PriceFilter
                                        data={data}
                                        maxPrice={data.maxPrice}
                                        minPrice={data.minPrice}
                                        dispatch={props.dispatchFn}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <AreaFilter
                                        maxArea={data.maxArea}
                                        minArea={data.minArea}
                                        dispatch={props.dispatchFn}
                                        data={data}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Fragment>
                )}
            </Grid>
        </Fragment>
    );
}
