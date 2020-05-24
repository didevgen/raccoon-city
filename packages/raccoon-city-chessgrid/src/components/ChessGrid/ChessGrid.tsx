import React, { useReducer, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { IconButton, SvgIcon } from "@material-ui/core";
import styled from "styled-components";
import { ChessGridFiltersDrawer } from "./ChessGridFiltersDrawer/ChessGridFiltersDrawer";
import { useQuery } from "@apollo/react-hooks";
import { House } from "../../shared/types/house.types";
import {
  GET_GROUPED_FLATS_CHESSGRID,
  GetGroupedFlatsBySectionQuery
} from "../../core/graphql/queries/houseQuery";

const StyledAppBar = styled(AppBar)`
  &.MuiAppBar-colorPrimary {
    background-color: #37485c;
  }
`;

const StyledIcon = styled(IconButton)`
  margin-left: auto !important;
`;

export enum ViewModeValues {
  AREA = "area",
  ROOM = "roomAmount",
  NUMBER = "flatNumber"
}

export const ViewModeContext = React.createContext({
  selectedViewMode: ViewModeValues.AREA
});

const initialState = {
  selectedViewMode: ViewModeValues.AREA,
  selectedRoomAmount: {},
  price: {
    minPrice: 0,
    maxPrice: 0
  },
  area: {
    minArea: 0,
    maxArea: 0
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "mode":
      return { ...state, selectedViewMode: action.payload };
    case "roomAmount":
      return { ...state, selectedRoomAmount: action.payload };
    case "price":
      return { ...state, price: action.payload };
    case "area":
      return { ...state, area: action.payload };
    case "minMaxInit":
      return {
        ...state,
        area: action.payload.area,
        price: action.payload.price
      };
    default:
      throw new Error();
  }
}

function ShowFilter({ setShownFilters }) {
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

export function ChessGrid({ uuid, hasSelect }: any) {
  const [filterShown, setShownFilters] = useState(false);
  const [filters, dispatch] = useReducer(reducer, initialState);
  const [id, setId] = useState(uuid ? [uuid] : []);
  const { data, error, loading } = useQuery<GetGroupedFlatsBySectionQuery>(
    GET_GROUPED_FLATS_CHESSGRID,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        uuid: id
      },
      skip: id.length === 0
    }
  );

  let onHouseChange;
  if (hasSelect) {
    onHouseChange = async (houses: House[]) => {
      if (houses) {
        setId(houses.map(h => h.id));
      } else {
        setId([]);
      }
    };
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledAppBar>
        <Toolbar>
          <ShowFilter setShownFilters={setShownFilters} />
        </Toolbar>
      </StyledAppBar>
      <Toolbar />
      <Container maxWidth={false}>
        <ChessGridFiltersDrawer
          filterShown={filterShown}
          setShownFilters={setShownFilters}
          dispatchFn={dispatch}
          data={id.length === 0 ? null : data}
          onHouseChange={onHouseChange}
        />
        <Box my={2}>
          {[...new Array(12)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
            )
            .join("\n")}
        </Box>
      </Container>
    </React.Fragment>
  );
}
