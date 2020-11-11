import React from 'react';

import {AutoSizer, List} from 'react-virtualized';
import styled from 'styled-components';
import {FLAT_STATUSES} from '../../../../core/constants';
import {isActive} from '../ChessGrid.utils';
import {DataTable, Header, RowContainer, TableCellContainer, TableRowCellContainer} from './ChessListView.styled';

const ListViewBox = styled.div`
    overflow-x: scroll;
    min-width: 900px;
    margin-top: 16px;
`;

const StyledDataTable = styled(DataTable)`
    height: 75vh;
`;

export class ChessListView extends React.Component<any> {
    public shouldComponentUpdate(nextProps): boolean {
        const {filters} = this.props as any;
        const {filters: nextFilters} = nextProps;

        const isRender = JSON.stringify(filters) === JSON.stringify(nextFilters);

        return !isRender;
    }

    public render() {
        const {filters, onSelect, listData} = this.props as any;
        const filteredList = listData.filter((flat) => isActive(flat, filters));

        return (
            <ListViewBox>
                <div>
                    <Header>
                        <TableCellContainer>Секция</TableCellContainer>
                        <TableCellContainer>Площадь</TableCellContainer>
                        <TableCellContainer>№ Квартиры</TableCellContainer>
                        <TableCellContainer>Этаж</TableCellContainer>
                        <TableCellContainer>Цена</TableCellContainer>
                        <TableCellContainer>Кол-во комнат</TableCellContainer>
                        <TableCellContainer>Цена за м2</TableCellContainer>
                        <TableCellContainer>Статус</TableCellContainer>
                        <TableCellContainer>Кол-во этажей</TableCellContainer>
                    </Header>

                    <StyledDataTable>
                        <AutoSizer>
                            {({width, height}) => (
                                <List
                                    width={width}
                                    height={height}
                                    rowHeight={80}
                                    style={{outline: 'none', overflow: 'overlay'}}
                                    rowCount={filteredList.length}
                                    rowRenderer={({key, index, style, parent}) => {
                                        const flat = filteredList[index];

                                        return (
                                            <RowContainer key={key} onClick={() => onSelect(flat)} style={style}>
                                                <TableRowCellContainer>{flat.section}</TableRowCellContainer>
                                                <TableRowCellContainer>{flat.area}</TableRowCellContainer>
                                                <TableRowCellContainer>{flat.flatNumber}</TableRowCellContainer>
                                                <TableRowCellContainer>{flat.level}</TableRowCellContainer>
                                                <TableRowCellContainer>{flat.price}</TableRowCellContainer>
                                                <TableRowCellContainer>{flat.roomAmount}</TableRowCellContainer>
                                                <TableRowCellContainer>{flat.squarePrice}</TableRowCellContainer>
                                                <TableRowCellContainer>
                                                    {
                                                        FLAT_STATUSES.find((statuses) => statuses.value === flat.status)
                                                            ?.label
                                                    }
                                                </TableRowCellContainer>
                                                <TableRowCellContainer>{flat.levelAmount}</TableRowCellContainer>
                                            </RowContainer>
                                        );
                                    }}
                                />
                            )}
                        </AutoSizer>
                    </StyledDataTable>
                </div>
            </ListViewBox>
        );
    }
}
