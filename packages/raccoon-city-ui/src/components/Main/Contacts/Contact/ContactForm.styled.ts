import styled from 'styled-components';
import {IconButton, Paper} from '@material-ui/core';
import List from '@material-ui/core/List';

export const ContactFormWrapper = styled.div`
    width: 40%;
    background-color: #fff;
    border-right: 3px solid #dbdbdb;
`;

export const TitleArea = styled.div`
    height: 30%;
    max-height: 240px;
    background-color: #37485c;
    color: #fff;
    display: flex;
    flex-direction: column;
`;

export const TabContainer = styled(Paper)`
    box-shadow: none;
    background-color: #37485c !important;
    .MuiButtonBase--root {
        color: #fff !important;
    }
    .MuiTab-textColorPrimary {
        color: #fff !important;
    }
    .MuiTabs-indicator {
        background-color: #fff !important;
    }
    margin-top: auto;
`;

export const OptionsArea = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const TitleWrapper = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;

    .MuiInputBase-input,
    .EditIcon {
        font-size: 24px;
        line-height: 24px;
        color: #fff;
    }
`;

export const OptionIcon: any = styled(IconButton)`
    &.MuiIconButton-root {
        color: white !important;
    }
`;

export const ButtonWrapper = styled.div`
    padding: 16px;
`;
export const StyledList = styled(List)`
    display: flex;
    padding: 8px !important;
    align-items: center;
    margin-left: 8px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
        cursor: pointer;
    }
`;

export const RootContainer = styled.div`
    width: '100%';
`;

export const TradeTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Bold = styled.span`
    font-weight: 600;
    margin: 10px;
`;
