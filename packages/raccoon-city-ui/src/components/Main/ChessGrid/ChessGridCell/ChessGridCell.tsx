import React, {Fragment, useContext} from 'react';
import {Flat} from '../../../shared/types/flat.types';
import {ChessCellViewMode} from '../ChessEnums';
import {CellViewModeContext, ViewModeContext} from '../ChessGrid';
import {
    AreaContainer,
    Cell,
    DataContainer,
    HtmlTooltip,
    NumberContainer,
    PriceContainer,
    StyledBagde,
    TooltipContainer,
    PriceAndAmountContainer,
    PreviewCell,
    TilePlusFirstSection,
    TilePlusSecondSection,
    TilePlusAreaInfo,
    TilePlusPriceInfo,
    TilePlusSquarePriceInfo
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
    const isSoldOut = flat.status === 'SOLD_OUT';

    const CellViewJSX = {
        [ChessCellViewMode.TILE]: <>{flat[viewContextValue.selectedViewMode]}</>,
        [ChessCellViewMode.TILE_PLUS]: (
            <Fragment>
                <TilePlusFirstSection>№{flat.flatNumber}</TilePlusFirstSection>
                <TilePlusSecondSection>
                    <TilePlusAreaInfo>
                        {`${flat.roomAmount}к`} <span>{flat.area}м2</span>
                    </TilePlusAreaInfo>
                    <TilePlusPriceInfo>
                        <TilePlusSquarePriceInfo>
                            1м2 - {flat.squarePriceSale || flat.squarePrice || '0'} грн
                        </TilePlusSquarePriceInfo>
                        <ReducedPrice flat={flat} />
                    </TilePlusPriceInfo>
                </TilePlusSecondSection>
            </Fragment>
        )
    };

    // TODO show price inside CRM
    const priceField = isSoldOut ? null : (
        <div className="Cell__price">
            <ReducedPrice flat={flat} />
        </div>
    );

    return (
        <HtmlTooltip
            title={
                <TooltipContainer>
                    <PriceContainer>
                        <PreviewCell className={flat.status}>{flat.roomAmount}</PreviewCell>
                        <PriceAndAmountContainer>
                            {priceField}
                            <div>1 м2 - {flat.squarePriceSale || flat.squarePrice} грн</div>
                        </PriceAndAmountContainer>
                    </PriceContainer>
                    <DataContainer>
                        <NumberContainer>
                            <div>№{flat.flatNumber}</div>
                        </NumberContainer>
                        <AreaContainer>{flat.area}м2</AreaContainer>
                    </DataContainer>
                </TooltipContainer>
            }
        >
            {flat.levelAmount > 1 ? (
                <StyledBagde badgeContent={flat.levelAmount}>
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
