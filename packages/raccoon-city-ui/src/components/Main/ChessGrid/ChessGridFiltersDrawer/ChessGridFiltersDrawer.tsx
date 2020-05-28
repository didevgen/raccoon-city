import {IconButton, SvgIcon, SwipeableDrawer, useMediaQuery, useTheme} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {ChessGridFilters} from '../ChessGridFilters/ChessGridFilters';

const StyledDrawer = styled(SwipeableDrawer)`
    .MuiDrawer-paper {
        padding: 24px;
        position: relative;
        overflow: visible;
    }
    .MuiDrawer-paperAnchorRight {
        width: 100%;
    }
`;

const StyledIcon = styled(IconButton)``;

const IconContainer = styled.div`
    position: absolute;
    right: 24px;
    top: 24px;
`;

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    @media (max-width: 889px) {
        margin-top: 32px;
    }
`;

export function ShowFilter({setShownFilters}) {
    return (
        <StyledIcon
            onClick={() => {
                setShownFilters(true);
            }}
        >
            <SvgIcon>
                <svg viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="#fff"
                        d="M6.81859 6.1579L10.7457 1.10842C10.8564 0.965784 10.9063 0.784966 10.8846 0.605478C10.8629 0.425991 10.7713 0.262426 10.6298 0.150526C10.5153 0.0581892 10.3743 0.00539545 10.2275 0H0.682539C0.528753 0.000895223 0.379786 0.0539428 0.259833 0.150526C0.118319 0.262426 0.0266916 0.425991 0.00497398 0.605478C-0.0167436 0.784966 0.0332138 0.965784 0.14393 1.10842L4.09146 6.1579V10.1742C4.07912 10.2777 4.09052 10.3827 4.12479 10.4811C4.15906 10.5796 4.21528 10.6688 4.28918 10.7421L5.65274 12.1105C5.78048 12.238 5.95328 12.3095 6.1334 12.3095C6.31352 12.3095 6.48632 12.238 6.61406 12.1105C6.68917 12.0379 6.74667 11.9489 6.78213 11.8504C6.81759 11.752 6.83007 11.6467 6.81859 11.5426V6.1579ZM8.18216 9.57895L11.5911 13L15 9.57895H8.18216Z"
                    />
                </svg>
            </SvgIcon>
        </StyledIcon>
    );
}

export function HideFilter({setShownFilters}) {
    return (
        <StyledIcon
            onClick={() => {
                setShownFilters(false);
            }}
        >
            <SvgIcon>
                <svg viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="#37485c"
                        d="M9.01167 12.0473L11.0172 10.1351L9.01167 8.22297L10.0074 7.27027L12.0058 9.16892L14.0043 7.27027L15 8.22297L13.0157 10.1351L15 12.0473L14.0043 13L12.0058 11.0811L10.0074 13L9.01167 12.0473ZM7.06264 6.08108V11.4054C7.09089 11.6081 7.02027 11.8243 6.85785 11.9662C6.58245 12.2297 6.13756 12.2297 5.86215 11.9662L4.44275 10.6081C4.28033 10.4527 4.20971 10.2432 4.23796 10.0473V6.08108H4.21677L0.14923 1.09459C-0.0908683 0.804054 -0.0343746 0.378378 0.269279 0.148649C0.403451 0.0540541 0.551747 0 0.707105 0H10.5935C10.7489 0 10.8971 0.0540541 11.0313 0.148649C11.335 0.378378 11.3915 0.804054 11.1514 1.09459L7.08383 6.08108H7.06264Z"
                    />
                </svg>
            </SvgIcon>
        </StyledIcon>
    );
}

export function ChessGridFiltersDrawer({setShownFilters, filterShown, ...props}: any) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <StyledDrawer
            onOpen={() => {
                // silence
            }}
            anchor={matches ? 'right' : 'top'}
            open={filterShown}
            onClose={() => {
                setShownFilters(false);
            }}
        >
            <FilterContainer>
                <IconContainer>
                    <HideFilter setShownFilters={setShownFilters} />
                </IconContainer>
                <ChessGridFilters {...props} />
            </FilterContainer>
        </StyledDrawer>
    );
}
