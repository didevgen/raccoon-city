import {useQuery} from '@apollo/react-hooks';
import {format, parseISO} from 'date-fns';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import React from 'react';
import {GET_HISTORY} from '../../../../../graphql/queries/fileHistoryQuery';
import {useParams} from 'react-router-dom';

export function ApartmentComplexHistory() {
    const {apartmentComplexUuid} = useParams();
    const {data, loading, error} = useQuery(GET_HISTORY, {
        variables: {
            apartmentComplexId: apartmentComplexUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (error || loading) {
        return null;
    }

    if (!data.getHistory) {
        return null;
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Файл</TableCell>
                        <TableCell>Скачать</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.getHistory.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {format(parseISO(row.timestamp), 'dd.MM.yyyy HH:mm')}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                                <Button variant="outlined" color="primary" target="_blank" href={row.downloadUrl}>
                                    Скачать
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
