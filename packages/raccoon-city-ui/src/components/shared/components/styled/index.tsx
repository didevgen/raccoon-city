import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Fab} from '@material-ui/core';

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
