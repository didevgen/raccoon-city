import styled from 'styled-components';
import {SwipeableDrawer, Typography} from '@material-ui/core';

export const ChessGridWrapper: any = styled.div`
    display: flex;
    flex-direction: row;
`;

export const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Container = styled.div`
    background-color: #fff;
    padding: 0 16px;
    border-right: 1px solid #cccccc;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
`;

export const ColumnTitle = styled(Typography)`
    text-align: center;
    padding: 16px 0;
`;

export const SidebarDrawer = styled(SwipeableDrawer)`
    max-width: 100vw;
    .MuiDrawer-paper {
        max-width: 100%;
    }
`;
