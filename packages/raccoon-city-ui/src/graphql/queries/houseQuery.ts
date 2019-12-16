import {gql} from 'apollo-boost';

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
