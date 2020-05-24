import {
  Drawer,
  IconButton,
  SvgIcon,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { ChessGridFilters } from "../ChessGridFilters/ChessGridFilters";

const StyledDrawer = styled(Drawer)`
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
`;

export function HideFilter({ setShownFilters }) {
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

export function ChessGridFiltersDrawer({
  setShownFilters,
  filterShown,
  ...props
}: any) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledDrawer
      anchor={matches ? "right" : "top"}
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
