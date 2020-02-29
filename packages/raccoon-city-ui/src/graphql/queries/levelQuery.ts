import {gql} from 'apollo-boost';

export const GET_GROUPED_LEVELS = gql`
    query getSelectedLevelLayouts($levelLayoutId: String, $houseId: String!) {
        getSelectedLevelLayouts(levelLayoutId: $levelLayoutId, houseId: $houseId) {
            id
            section
            levels {
                id
                level
                isSelected
            }
        }
    }
`;

export const GET_LEVEL_LAYOUT_FLAT_LAYOUTS = gql`
    query getLevelLayoutFlatLayouts($levelLayoutId: String) {
        getLevelLayoutFlatLayouts(levelLayoutId: $levelLayoutId) {
            id
            path
        }
    }
`;
