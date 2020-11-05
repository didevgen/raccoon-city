import styled from 'styled-components';
import {SwipeableDrawer, Typography} from '@material-ui/core';
import Select from '@material-ui/core/Select';

export const ChessGridWrapper: any = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-width: 700px;
    margin-top: 20px;

    @media only screen and (max-width: 600px) {
        min-width: 320px;
        overflow-x: auto;
        background-color: #fff;
    }
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
    width: 100%;
`;

export const ColumnAndSectionBarWrapper = styled.div`
    display: flex;
    justify-content: space-around;

    @media only screen and (max-width: 600px) {
        flex-direction: column;
    }
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

export const SelectStyled = styled(Select)`
    margin: 0 20px;
`;

export const MobileInformation = styled.div`
    display: none;

    @media only screen and (max-width: 600px) {
        display: flex;
        justify-content: flex-start;
    }
`;

export const InfoIcon = styled.div`
    border: 1px solid #e84f1d;
    border-radius: 8px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    &::before {
        content: 'i';
        font-size: 15px;
        color: #e84f1d;
    }
`;
