import React, {Fragment, useContext} from 'react';
import {Flat} from '../../../shared/types/flat.types';
import {ChessCellViewMode, ViewModeValues} from '../ChessEnums';
import {CellViewModeContext, ViewModeContext} from '../ChessGrid';
import {
    AreaContainer,
    Cell,
    CellInfoWrapper,
    CellInfoWrapperTop,
    DataContainer,
    FirstInfoItem,
    HtmlTooltip,
    NumberContainer,
    PriceContainer,
    StyledBagde,
    TooltipContainer
} from './ChessGridCell.styled';

interface Props {
    flat: Flat;
    onSelect: (flat: Flat) => void;
}

function ReducedPrice({flat}) {
    const price = flat.area * flat.squarePrice;
    const salePrice = flat.area * (flat.squarePriceSale || -1);

    if (salePrice < 0) {
        return <span>{price.toFixed(2)} грн</span>;
    }

    return (
        <span>
            <del>{price.toFixed(2)}</del> <span>{salePrice.toFixed(2)}</span> грн
        </span>
    );
}
export const ChessGridCell = React.memo(({flat, onSelect}: Props) => {
    const viewContextValue = useContext<any>(ViewModeContext);
    const cellView = useContext<any>(CellViewModeContext);

    const CellViewJSX = {
        [ChessCellViewMode.TILE]: <>{flat[viewContextValue.selectedViewMode]}</>,
        [ChessCellViewMode.TILE_PLUS]: (
            <Fragment>
                <CellInfoWrapperTop>
                    <FirstInfoItem>{`${flat.roomAmount}к`}</FirstInfoItem>
                    <ReducedPrice flat={flat} />
                </CellInfoWrapperTop>
                <CellInfoWrapperTop>
                    <FirstInfoItem>№{flat.flatNumber}</FirstInfoItem>
                    <span>{flat.area}/м2</span>
                </CellInfoWrapperTop>
                <CellInfoWrapper>
                    <span>{flat.squarePriceSale || flat.squarePrice} - цена за м2</span>
                </CellInfoWrapper>
            </Fragment>
        )
    };

    return (
        <HtmlTooltip
            title={
                <TooltipContainer>
                    <PriceContainer>
                        <Cell className={flat.status}>
                            {viewContextValue.selectedViewMode === ViewModeValues.AREA ? flat.area : flat.roomAmount}
                        </Cell>
                        <div className="Cell__price">
                            <ReducedPrice flat={flat} />
                        </div>
                    </PriceContainer>
                    <DataContainer>
                        {viewContextValue.selectedViewMode === ViewModeValues.ROOM ? (
                            <AreaContainer>{flat.area}м2</AreaContainer>
                        ) : (
                            <AreaContainer>Комнат: {flat.roomAmount}</AreaContainer>
                        )}

                        <NumberContainer>
                            <div>№{flat.flatNumber}</div>
                            {<div>{flat.squarePriceSale || flat.squarePrice} - цена за м2</div>}
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
                        viewMode={cellView.mode}
                    >
                        {CellViewJSX[cellView.mode] || flat[viewContextValue.selectedViewMode]}
                    </Cell>
                </StyledBagde>
            ) : (
                <Cell
                    className={flat.isActive ? flat.status : 'MUTED'}
                    onClick={() => {
                        onSelect(flat);
                    }}
                    viewMode={cellView.mode}
                >
                    {CellViewJSX[cellView.mode] || flat[viewContextValue.selectedViewMode]}
                </Cell>
            )}
        </HtmlTooltip>
    );
});
