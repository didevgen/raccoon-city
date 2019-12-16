import {Typography} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {Flat} from '../../../shared/types/flat.types';
import {ChessGridRow} from '../ChessGridRow/ChessGridRow';

const ColumnWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
`;

const ColumnTitle = styled.div`
    align-self: center;
    margin-top: 8px;
`;

const CellContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
`;

interface ChessGridColumnProps {
    columnName: string;
    level: Array<{
        level: number;
        flats: Flat[];
    }>;
}

export function ChessGridColumn(props: ChessGridColumnProps) {
    return (
        <ColumnWrapper>
            <CellContainer>
                {props.level.map((level) => {
                    return (
                        <ChessGridRow key={`level${level.level}`} rowName={String(level.level)} flats={level.flats} />
                    );
                })}
            </CellContainer>
            <ColumnTitle>
                <Typography variant="subtitle1" gutterBottom={true}>
                    Подъезд №{props.columnName}
                </Typography>
            </ColumnTitle>
        </ColumnWrapper>
    );
}
