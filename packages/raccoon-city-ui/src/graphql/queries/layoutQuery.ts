import {gql} from 'apollo-boost';
import {GroupedFlats} from './houseQuery';
import {HouseLayout} from '../../components/shared/types/layout.types';

export const GET_LAYOUTS = gql`
    query getFlatLayouts($houseId: String!) {
        getFlatLayouts(houseId: $houseId) {
            id
            name
            image {
                downloadUrl
                previewImageUrl
            }
        }
    }
`;

export interface GetLayoutQuery {
    getFlatLayout: HouseLayout;
}
export const GET_LAYOUT = gql`
    query getFlatLayout($layoutId: String!) {
        getFlatLayout(layoutId: $layoutId) {
            id
            name
            image {
                downloadUrl
                previewImageUrl
            }
            flats {
                id
                flatNumber
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
`;
export interface GetGroupedFlatsWithLayoutQuery {
    getChessGridLayout: GroupedFlats[];
}
export const GET_GROUPED_FLATS_WITH_LAYOUT = gql`
    query getChessGridLayout($houseId: String!, $layoutId: String!) {
        getChessGridLayout(houseId: $houseId, layoutId: $layoutId) {
            id
            section
            levels {
                id
                level
                flats {
                    id
                    flatNumber
                    levelAmount
                    price
                    level
                    section
                    area
                    status
                    roomAmount
                    belongsToLayout
                    hasLayout
                }
            }
        }
    }
`;

export const GET_LEVEL_LAYOUTS = gql`
    query getLevelLayouts($houseId: String!) {
        getLevelLayouts(houseId: $houseId) {
            id
            name
            image {
                downloadUrl
                previewImageUrl
            }
        }
    }
`;
