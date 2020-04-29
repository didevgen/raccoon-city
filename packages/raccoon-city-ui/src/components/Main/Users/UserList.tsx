import {useQuery} from '@apollo/react-hooks';
import {Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';
import {GET_USERS} from '../../../graphql/queries/userQuery';
import {UserDialog} from './UserDialog';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        marginTop: 16
    }
});

export function UserList() {
    const classes = useStyles();
    const {data, loading, error} = useQuery(GET_USERS);

    if (loading || error) {
        return null;
    }

    return (
        <TableContainer component={Paper}>
            <UserDialog />
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Активен</TableCell>
                        <TableCell>Id</TableCell>
                        <TableCell align="left">Имя</TableCell>
                        <TableCell align="left">Почта</TableCell>
                        <TableCell align="left">Роли</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.getUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell padding="checkbox">
                                <Checkbox checked={!user.isDeleted} disabled />
                            </TableCell>
                            <TableCell align="left" component="th" scope="row">
                                {user.id}
                            </TableCell>
                            <TableCell align="left">{user.name}</TableCell>
                            <TableCell align="left">{user.email}</TableCell>
                            <TableCell align="left">{user.features.join(', ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
