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
import {FlatStatusesBar} from '../FlatStatusesBar';

const DesktopFilterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    position: relative;
`;

const FlatStatusesBarWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
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
                    <FlatStatusesBarWrapper>
                        <FlatStatusesBar houseId={props.houseId} />
                    </FlatStatusesBarWrapper>
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
