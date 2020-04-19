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
            price
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
            address
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

export interface GetGroupedFlatsBySectionQuery {
    getGroupedFlatsBySection: {
        maxPrice: number;
        minPrice: number;
        maxArea: number;
        minArea: number;
        groupedFlats: GroupedFlats[];
    };
}

export const GET_GROUPED_FLATS_CHESSGRID = gql`
    query getGroupedFlatsBySection($uuid: String!) {
        getGroupedFlatsBySection(uuid: $uuid) {
            maxPrice
            minPrice
            maxArea
            minArea
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
                        roomAmount
                        layout {
                            id
                            image {
                                uuid
                                downloadUrl
                                previewImageUrl
                            }
                            images {
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
                }
            }
        }
    }
`;
export const GET_GROUPED_FLATS = gql`
    query getGroupedFlatsBySection($uuid: String!) {
        getGroupedFlatsBySection(uuid: $uuid) {
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
                        roomAmount
                    }
                }
            }
        }
    }
`;
