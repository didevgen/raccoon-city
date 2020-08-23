import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';

export const ListContainer = styled(Table)`
    width: 90%;
    overflow-y: auto;
`;

export const TableRowContainer = styled(TableRow)`
    cursor: pointer;
`;
