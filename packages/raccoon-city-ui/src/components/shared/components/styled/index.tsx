import {Card, CardMedia, Fab} from '@material-ui/core';
import {Link, NavLink} from 'react-router-dom';
import styled from 'styled-components';

export const StyledLink = styled(Link)`
    text-decoration: none;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
        color: inherit;
    }
`;

export const StyledNavLink = styled(NavLink)`
    text-decoration: none;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
        color: inherit;
    }

    &.Mui-selected > div {
        color: white;
        background-color: #37485c;
        &:hover {
            background-color: #5d7a9c;
        }
    }
`;

export const FabButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const StyledFab = styled(Fab)`
    &.MuiFab-root {
        width: 140px;
        height: 140px;
        .MuiSvgIcon-root {
            width: 3em;
            height: 3em;
        }
    }
`;

const getColor = (props: any) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
};

export const DropzoneContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${(props) => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;
`;

export const StyledCard = styled(Card)`
    max-width: 345px;
    width: 100%;
`;

export const StyledCardMedia = styled(CardMedia)`
    height: 0;
    padding-top: 56.25%;
`;
