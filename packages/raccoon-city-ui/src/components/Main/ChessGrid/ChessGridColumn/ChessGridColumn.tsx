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

    @media (max-width: 889px) {
        flex-direction: column-reverse;
    }
`;

const ColumnTitle = styled.div`
    align-self: center;
    margin-top: 8px;
`;

const CellContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

interface ChessGridColumnProps {
    columnName: string;
    levels: Array<{
        id: string;
        level: number;
        flats: Flat[];
    }>;
    onSelect: (flat: Flat) => void;
}

export class ChessGridColumn extends React.Component<ChessGridColumnProps> {
    public shouldComponentUpdate(
        nextProps: Readonly<ChessGridColumnProps>,
        nextState: Readonly<{}>,
        nextContext: any
    ): boolean {
        return false;
    }

    public render() {
        return (
            <ColumnWrapper className="ChessGridColumn">
                <CellContainer className="ChessGridColumn__cell">
                    {this.props.levels.map((level) => {
                        return (
                            <ChessGridRow
                                key={level.id}
                                rowName={String(level.level)}
                                flats={level.flats}
                                onSelect={this.props.onSelect}
                            />
                        );
                    })}
                </CellContainer>
                <ColumnTitle>
                    <Typography variant="subtitle1" gutterBottom={true}>
                        Подъезд №{this.props.columnName}
                    </Typography>
                </ColumnTitle>
            </ColumnWrapper>
        );
    }
}
