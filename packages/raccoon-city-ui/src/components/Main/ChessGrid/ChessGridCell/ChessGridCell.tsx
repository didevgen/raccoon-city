import {Badge, Theme, withStyles} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {Flat} from '../../../shared/types/flat.types';
import {ViewModeContext, ViewModeValues} from '../ChessGrid';

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#fff',
        color: '#000',
        padding: '8px',
        boxShadow: theme.shadows[3]
    }
}))(Tooltip);

const Cell = styled.div`
    color: #fff;
    background-color: #4caf50;
    font-weight: 500;
    border-radius: 0;
    margin: 8px;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    &:hover {
        cursor: pointer;
    }

    &.MUTED {
        background-color: #9e9e9e;
        &:hover {
            background-color: #e0e0e0;
        }
        color: #000;
    }

    &.SOLD_OUT {
        background-color: #f44336;
        &:hover {
            background-color: #e57373;
        }
    }

    &.FREE {
        background-color: #4caf50;
        &:hover {
            background-color: #66bb6a;
        }
    }

    &.RESERVED,
    &.BOOKED {
        color: #000;
        background-color: #ffeb3b;
        &:hover {
            background-color: #fff176;
        }
    }

    &.UNAVAILABLE {
        background-color: #9e9e9e;
        &:hover {
            background-color: #bdbdbd;
        }
    }

    &.DOCUMENTS_IN_PROGRESS {
        background-color: #00bcd4;
        &:hover {
            background-color: #26c6da;
        }
    }
`;

const TooltipContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
`;

const PriceContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 150px;
    .Cell__price {
        font-size: 14px;
    }
`;

const AreaContainer = styled.div`
    align-self: flex-end;
`;

const NumberContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DataContainer = styled.div`
    margin-left: 8px;
    font-size: 12px;
`;

const StyledBagde = styled(Badge)`
    .MuiBadge-badge {
        top: 10px;
        right: 10px;
    }
`;

export function ChessGridCell({flat, onSelect}: {flat: Flat; onSelect: (flat: Flat) => void}) {
    const viewContextValue = useContext<any>(ViewModeContext);
    return (
        <HtmlTooltip
            title={
                <TooltipContainer>
                    <PriceContainer>
                        <Cell className={flat.status}>
                            {viewContextValue.selectedViewMode === ViewModeValues.AREA ? flat.area : flat.roomAmount}
                        </Cell>
                        <div className="Cell__price">{flat.price} грн</div>
                    </PriceContainer>
                    <DataContainer>
                        {viewContextValue.selectedViewMode === ViewModeValues.ROOM ? (
                            <AreaContainer>{flat.area}м2</AreaContainer>
                        ) : (
                            <AreaContainer>Комнат: {flat.roomAmount}</AreaContainer>
                        )}

                        <NumberContainer>
                            <div>№{flat.flatNumber}</div>
                            {flat.squarePrice && <div>1м2 - {flat.squarePrice}</div>}
                        </NumberContainer>
                    </DataContainer>
                </TooltipContainer>
            }
        >
            {flat.levelAmount > 1 ? (
                <StyledBagde color="primary" badgeContent={flat.levelAmount}>
                    <Cell
                        className={flat.isActive ? flat.status : 'MUTED'}
                        onClick={() => {
                            onSelect(flat);
                        }}
                    >
                        {flat[viewContextValue.selectedViewMode]}
                    </Cell>
                </StyledBagde>
            ) : (
                <Cell
                    className={flat.isActive ? flat.status : 'MUTED'}
                    onClick={() => {
                        onSelect(flat);
                    }}
                >
                    {flat[viewContextValue.selectedViewMode]}
                </Cell>
            )}
        </HtmlTooltip>
    );
}
