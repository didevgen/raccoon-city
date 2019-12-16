import React from 'react';
import styled from 'styled-components';
import {Flat} from '../../../shared/types/flat.types';
import {ChessGridCell} from '../ChessGridCell/ChessGridCell';

const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const RowTitle = styled.div`
    width: 16px;
    margin-right: 8px;
`;

interface ChessGridItem {
    rowName: string;
    flats: Flat[];
}

export function ChessGridRow(props: ChessGridItem) {
    return (
        <RowWrapper>
            <RowTitle>{props.rowName}</RowTitle>
            {props.flats.map((flat: Flat) => {
                return <ChessGridCell key={flat.id} flat={flat} />;
            })}
        </RowWrapper>
    );
}
