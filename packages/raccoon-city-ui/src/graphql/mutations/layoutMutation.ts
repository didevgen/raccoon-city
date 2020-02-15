import {gql} from 'apollo-boost';

export const CREATE_LAYOUT = gql`
    mutation createLayout($uuid: String!, $file: Upload!, $name: String!) {
        createLayout(houseId: $uuid, file: $file, name: $name) {
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
