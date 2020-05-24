import { gql } from "apollo-boost";
import { Flat } from "../../../shared/types/flat.types";

export const HOUSE_LIST = gql`
  query getHouses($apartmentComplexId: String!) {
    getHouses(apartmentComplexId: $apartmentComplexId) {
      id
      name
      images {
        CHESS_GRID {
          uuid
          downloadUrl
        }
      }
    }
  }
`;

export const HOUSE_INFO = gql`
  query getHouse($uuid: String!) {
    getHouse(uuid: $uuid) {
      id
      name
      parking
      price
      publishedDate
      images {
        CHESS_GRID {
          uuid
          downloadUrl
        }
        SITE {
          uuid
          downloadUrl
        }
        MOBILE {
          uuid
          downloadUrl
        }
        PHOTO {
          uuid
          downloadUrl
          name
        }
        VR {
          uuid
          downloadUrl
          name
          previewImageUrl
        }
        HALF_VR {
          uuid
          downloadUrl
          name
          previewImageUrl
        }
      }
    }
  }
`;

export const HOUSE_DATA = gql`
  query getHouse($uuid: String!) {
    getHouse(uuid: $uuid) {
      id
      name
      parking
      price
    }
  }
`;

export interface GroupedFlats {
  id: string;
  section: string;
  levels: Array<{
    id: string;
    level: number;
    flats: Flat[];
  }>;
}

export interface FlatsInHouse {
  id: string;
  name: string;
  groupedFlats: GroupedFlats[];
}

export interface GetGroupedFlatsBySectionQuery {
  getGroupedFlatsBySection: {
    maxPrice: number;
    minPrice: number;
    maxArea: number;
    minArea: number;
    houseFlats: FlatsInHouse[];
  };
}

export const GET_GROUPED_FLATS_CHESSGRID = gql`
  query getPublicGroupedFlatsBySection($uuid: [String]) {
    getPublicGroupedFlatsBySection(uuid: $uuid) {
      maxPrice
      minPrice
      maxArea
      minArea
      houseFlats {
        id
        name
        groupedFlats {
          id
          section
          levels {
            id
            level
            flats {
              id
              flatNumber
              levelAmount
              fakeLevel
              price
              level
              section
              area
              status
              sale
              squarePrice
              roomAmount
            }
          }
        }
      }
    }
  }
`;
export const GET_GROUPED_FLATS = gql`
  query getGroupedHouseData($uuid: String!) {
    getGroupedHouseData(uuid: $uuid) {
      groupedFlats {
        id
        section
        levels {
          id
          level
          flats {
            id
            flatNumber
            price
            level
            section
            area
            status
            squarePrice
            sale
            roomAmount
            levelAmount
          }
        }
      }
    }
  }
`;
