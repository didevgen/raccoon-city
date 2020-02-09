import {gql} from 'apollo-boost';

export const CREATE_LAYOUT = gql`
    mutation createLayout($uuid: String!, $file: Upload!, $name: String!) {
        createLayout(houseId: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;
