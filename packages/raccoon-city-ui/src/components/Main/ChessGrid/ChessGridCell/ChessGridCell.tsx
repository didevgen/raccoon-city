import React, {useContext} from 'react';
import {Flat} from '../../../shared/types/flat.types';
import {ViewModeContext, ViewModeValues, ChessCellViewMode, cellViewModeContext} from '../ChessGrid';
import {
    Cell,
    TooltipContainer,
    PriceContainer,
    AreaContainer,
    NumberContainer,
    DataContainer,
    StyledBagde,
    HtmlTooltip,
    FirstInfoItem,
    CellInfoWrapper,
    CellInfoWrapperTop
} from './ChessGridCell.styled';

interface Props {
    flat: Flat;
    onSelect: (flat: Flat) => void;
}

export const ChessGridCell = React.memo(({flat, onSelect}: Props) => {
    const viewContextValue = useContext<any>(ViewModeContext);
    const cellView = useContext<any>(cellViewModeContext);

    const CellViewJSX = {
        [ChessCellViewMode.TILE]: <>{flat[viewContextValue.selectedViewMode]}</>,
        [ChessCellViewMode.TILE_PLUS]: (
            <>
                <CellInfoWrapperTop>
                    <FirstInfoItem>{`${flat.roomAmount}к`}</FirstInfoItem>
                    <span>
                        {`${flat.price} грн.`}
                        {}
                    </span>
                </CellInfoWrapperTop>
                <CellInfoWrapperTop>
                    <FirstInfoItem>№{flat.flatNumber}</FirstInfoItem>
                    <span>{flat.area}/м2</span>
                </CellInfoWrapperTop>
                <CellInfoWrapper>
                    <span>{flat.squarePrice} - цена за м2</span>
                </CellInfoWrapper>
            </>
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
