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
    id: string;
    section: string;
    levels: Array<{
        id: string;
        level: number;
        flats: Flat[];
    }>;
}

export interface GetGroupedFlatsBySectionQuery {
    getGroupedFlatsBySection: GroupedFlats[];
}

export const GET_GROUPED_FLATS = gql`
    query getGroupedFlatsBySection($uuid: String!) {
        getGroupedFlatsBySection(uuid: $uuid) {
            id
            section
            levels {
                id
                level
                flats {
                    id
                    flatNumber
                    price
                    area
                    status
                    roomAmount
                }
            }
        }
    }
`;
