import {Grid} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {
    AreaFilter,
    ChessGridFiltersProps,
    PriceFilter,
    RoomAmountFilter,
    SelectContainer,
    ViewMode
} from './ChessGridFilters';
import {ChessGridHouseSelect} from './ChessGridHouseSelect';
import {ViewModeFilters} from './ViewModeFilters';

const DesktopFilterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`;

const RangeContainer = styled.div``;

export function ChessGridDesktopFilters(props: ChessGridFiltersProps) {
    const data = props?.data?.getGroupedFlatsBySection;
    const hasPrices = data && data?.houseFlats?.length > 0;
    return (
        <Grid container spacing={1}>
            {props.onHouseChange && (
                <Grid item xs={12}>
                    <SelectContainer>
                        <ChessGridHouseSelect onChange={props.onHouseChange} isPublic={props.isPublic} />
                    </SelectContainer>
                </Grid>
            )}
            {hasPrices && (
                <DesktopFilterWrapper>
                    <RoomAmountFilter dispatch={props.dispatchFn} />
                    <RangeContainer>
                        <PriceFilter
                            data={data}
                            maxPrice={data.maxPrice}
                            minPrice={data.minPrice}
                            dispatch={props.dispatchFn}
                        />
                    </RangeContainer>
                    <RangeContainer>
                        <AreaFilter
                            maxArea={data.maxArea}
                            minArea={data.minArea}
                            dispatch={props.dispatchFn}
                            data={data}
                        />
                    </RangeContainer>
                    <ViewMode dispatch={props.dispatchFn} />
                    <ViewModeFilters mode={props.filters.mode} dispatch={props.dispatchFn} />
                </DesktopFilterWrapper>
            )}
        </Grid>
    );
}
