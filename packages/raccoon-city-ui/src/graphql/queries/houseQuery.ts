import {gql} from 'apollo-boost';
import {Flat} from '../../components/shared/types/flat.types';

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
            address
            parking
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

export interface GroupedFlats {
    entrance: string;
    level: Array<{
        level: number;
        flats: Flat[];
    }>;
}

export interface GetGroupedFlatsByEntranceQuery {
    getGroupedFlatsByEntrance: GroupedFlats[];
}

export const GET_GROUPED_FLATS = gql`
    query getGroupedFlatsByEntrance($uuid: String!) {
        getGroupedFlatsByEntrance(uuid: $uuid) {
            entrance
            level {
                level
                flats {
                    id
                    flatNumber
                    price
                    level
                    entrance
                    area
                    status
                    roomAmount
                }
            }
        }
    }
`;
