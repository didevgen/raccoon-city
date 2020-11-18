import styled from 'styled-components';
import {SwipeableDrawer, Typography} from '@material-ui/core';
import Select from '@material-ui/core/Select';
//TO DO use this func in  ColumnAndSectionBarWrapper at width
// import {ChessCellViewMode} from './ChessEnums';

export const ChessGridWrapper: any = styled.div`
    box-sizing: border-box;
    margin-top: 20px;

    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    text-align: center;

    @media only screen and (max-width: 600px) {
        /* min-width: 320px; */
        overflow-x: auto;
        background-color: #fff;
    }
`;

export const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

// TODO check how comment on 28 line influence in project
export const Container = styled.div`
    overflow: auto;
    background-color: #fff;

    display: inline-block;
    vertical-align: top;
    margin: 0 auto;
`;

//TO DO use this func in  ColumnAndSectionBarWrapper at width
// function getChessWidth(props: any) {
// if (props.isPublic && props.mode === ChessCellViewMode.TILE_PLUS) {
//     return '90vw';
// } else if (props.isPublic) {
//     return '60vw';
// } else {
//     return '90vw';
// }
// }

export const ColumnAndSectionBarWrapper = styled.div<{isPublic: boolean; mode: string}>`
    display: flex;
    justify-content: space-around;
    overflow-x: auto;
    width:'auto'
    margin: 0 auto;

    @media only screen and (max-width: 900px) {
        justify-content: center;
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

export const HouseTitle = styled.p`
    font-size: 20px;
    margin: 0;
    margin-top: -60px;

    @media only screen and (max-width: 600px) {
        font-size: 18px;
        text-align: center;
        margin-bottom: 10px;
        margin-top: 0;
    }
`;
