import * as React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {ApartmentComplexType} from '../../../../shared/types/apartmentComplex.types';

interface ApartmentComplexDataProps {
    apartmentComplex: ApartmentComplexType;
}

function getTableRows(props: ApartmentComplexType) {
    return [
        {
            key: 'type',
            label: 'Тип объекта',
            value: props.type.displayName
        },
        {
            key: 'name',
            label: 'Название',
            value: props.name
        },
        {
            key: 'city',
            label: 'Город',
            value: props.city.displayName
        },
        {
            key: 'district',
            label: 'Район',
            value: props.district.displayName
        },
        {
            key: 'class',
            label: 'Класс',
            value: props.class.displayName
        },
        {
            key: 'levels',
            label: 'Этажность',
            value: props.levels
        },
        {
            key: 'sections',
            label: 'Количество секций',
            value: props.sections
        },
        {
            key: 'price',
            label: 'Цена за м2',
            value: props.price
        },
        {
            key: 'beginDate',
            label: 'Начало строительства',
            value: props.beginDate
        },
        {
            key: 'endDate',
            label: 'Конец строительства',
            value: props.endDate
        }
    ];
}
export function ApartmentComplexData(props: ApartmentComplexDataProps) {
    const rows = getTableRows(props.apartmentComplex);
    return (
        <Table aria-label="simple table">
            <TableBody>
                {rows.map((row) => {
                    return (
                        <TableRow key={row.key}>
                            <TableCell component="th" scope="row">
                                <Typography variant="body2" component="p">
                                    {row.label}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" component="p">
                                    {row.value}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
