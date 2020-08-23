import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {ListContainer, TableRowContainer} from './ChessListView.styled';
import {isActive} from '../ChessGrid.utils';
import {FLAT_STATUSES} from '../../../../core/constants';
import {FlatSidebarInfo} from '../FlatSidebarInfo/FlatSidebarInfo';

export class ChessListView extends React.Component<any> {
    public shouldComponentUpdate(): boolean {
        return false;
    }

    render() {
        const {filters, onSelect, listData} = this.props as any;
        const {getPublicFlatsList, getFlatsList} = listData;
        const flatsList = getFlatsList ? getFlatsList : getPublicFlatsList;

        return (
            <div>
                <TableContainer component={Paper}>
                    <ListContainer aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Секция</TableCell>
                                <TableCell align="right">Площадь</TableCell>
                                <TableCell align="right">№ Квартиры</TableCell>
                                <TableCell align="right">Этаж</TableCell>
                                <TableCell align="right">Цена</TableCell>
                                <TableCell align="right">Кол-во комнат</TableCell>
                                <TableCell align="right">Цена за м2</TableCell>
                                <TableCell align="right">Статус</TableCell>
                                <TableCell align="right">Кол-во этажей</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flatsList
                                .filter((flat) => isActive(flat, filters))
                                .map((flat: any) => (
                                    <TableRowContainer key={flat.id} onClick={() => onSelect(flat)}>
                                        <TableCell align="right">{flat.section}</TableCell>
                                        <TableCell align="right">{flat.area}</TableCell>
                                        <TableCell align="right">{flat.flatNumber}</TableCell>
                                        <TableCell align="right">{flat.level}</TableCell>
                                        <TableCell align="right">{flat.price}</TableCell>
                                        <TableCell align="right">{flat.roomAmount}</TableCell>
                                        <TableCell align="right">{flat.squarePrice}</TableCell>
                                        <TableCell align="right">
                                            {FLAT_STATUSES.find((statuses) => statuses.value === flat.status)?.label}
                                        </TableCell>
                                        <TableCell align="right">{flat.levelAmount}</TableCell>
                                    </TableRowContainer>
                                ))}
                        </TableBody>
                    </ListContainer>
                </TableContainer>

                <FlatSidebarInfo flat={flatsList[0]} isPublic={true} showRequestButton={true} />
            </div>
        );
    }
}
