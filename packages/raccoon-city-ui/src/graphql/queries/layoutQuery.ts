import {gql} from 'apollo-boost';
import {GroupedFlats} from './houseQuery';

export const GET_LAYOUTS = gql`
    query getLayouts($houseId: String!) {
        getLayouts(houseId: $houseId) {
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
                    price
                    level
                    section
                    area
                    status
                    roomAmount
                    belongsToLayout
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
