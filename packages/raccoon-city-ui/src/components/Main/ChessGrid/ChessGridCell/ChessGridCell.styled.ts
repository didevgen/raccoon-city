import styled, {css} from 'styled-components';
import {Badge, Theme, withStyles} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import {ChessCellViewMode} from '../ChessEnums';

const TileView = css`
    width: 56px;
    height: 56px;
`;

const TileViewPlus = css`
    width: 202px;
    height: auto;
    flex-direction: column;
    justify-contett: space-between;
    padding: 5px;
`;

const getCellView = (props) => {
    switch (props.viewMode) {
        case ChessCellViewMode.TILE:
            return TileView;
        case ChessCellViewMode.TILE_PLUS:
            return TileViewPlus;
        default:
            return TileView;
    }
};

export const CellInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

// @ts-ignore
export const CellInfoWrapperTop = styled(CellInfoWrapper)`
    margin-bottom: 10px;
`;

export const FirstInfoItem = styled.span`
    padding: 0 2px;
`;

export const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#fff',
        color: '#000',
        padding: '8px',
        boxShadow: theme.shadows[3]
    }
}))(Tooltip);

export const Cell = styled.div<{viewMode?: string}>`
    color: #fff;
    background-color: #3ab71e;
    font-weight: 500;
    border-radius: 0;
    margin: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;

    width: 145px;
    height: auto;
    flex-direction: column;
    padding: 5px;

    ${getCellView}

    @media (max-width: 889px) {
        width: 72px;
        height: 72px;
    }
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
        background-color: #e84f1d;
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

export const TooltipContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
`;

export const PriceContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 150px;
    .Cell__price {
        font-size: 14px;
    }
`;

export const AreaContainer = styled.div`
    align-self: flex-end;
`;

export const NumberContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const DataContainer = styled.div`
    margin-left: 8px;
    font-size: 12px;
`;

export const StyledBagde = styled(Badge)`
    .MuiBadge-badge {
        top: 10px;
        right: 10px;
    }
`;
