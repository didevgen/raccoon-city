import {gql} from 'apollo-boost';

export const CREATE_LAYOUT = gql`
    mutation createLayout($uuid: String!, $file: Upload!, $name: String!) {
        createLayout(houseId: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;

export const CREATE_LEVEL_LAYOUT = gql`
    mutation createLevelLayout($uuid: String!, $file: Upload!, $name: String!) {
        createLevelLayout(houseId: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;

export const ASSIGN_FLATS_TO_LAYOUT = gql`
    mutation assignFlatsToLayout($layoutId: String!, $flats: [String]) {
        assignFlatsToLayout(layoutId: $layoutId, flats: $flats) {
            id
        }
    }
`;

export const ASSIGN_LEVELS_TO_LAYOUT = gql`
    mutation assignLevelsToLayout($levelLayoutId: String!, $levels: [String]) {
        assignLevelsToLayout(levelLayoutId: $levelLayoutId, levels: $levels)
    }
`;
