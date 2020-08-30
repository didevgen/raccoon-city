import React from 'react';

import {TableRowCellContainer, RowContainer, TableCellContainer, DataTable} from './ChessListView.styled';
import {isActive} from '../ChessGrid.utils';
import {FLAT_STATUSES} from '../../../../core/constants';
import {List, AutoSizer} from 'react-virtualized';

export class ChessListView extends React.Component<any> {
    public shouldComponentUpdate(nextProps): boolean {
        const {filters} = this.props as any;
        const {filters: nextFilters} = nextProps;

        let isRender = JSON.stringify(filters) === JSON.stringify(nextFilters);

        return !isRender;
    }

    render() {
        const {filters, onSelect, listData} = this.props as any;
        const filteredList = listData.filter((flat) => isActive(flat, filters));

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        paddingRight: '15px',
                        backgroundColor: '#fff'
                    }}
                >
                    <TableCellContainer>Секция</TableCellContainer>
                    <TableCellContainer>Площадь</TableCellContainer>
                    <TableCellContainer>№ Квартиры</TableCellContainer>
                    <TableCellContainer>Этаж</TableCellContainer>
                    <TableCellContainer>Цена</TableCellContainer>
                    <TableCellContainer>Кол-во комнат</TableCellContainer>
                    <TableCellContainer>Цена за м2</TableCellContainer>
                    <TableCellContainer>Статус</TableCellContainer>
                    <TableCellContainer>Кол-во этажей</TableCellContainer>
                </div>

                <DataTable
                    style={{
                        width: '100%',
                        height: '63vh'
                    }}
                >
                    <AutoSizer>
                        {({width, height}) => (
                            <List
                                width={width}
                                height={height}
                                rowHeight={50}
                                style={{outline: 'none'}}
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
                </DataTable>
            </div>
        );
    }
}
