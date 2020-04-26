import {gql} from 'apollo-boost';

export const GET_USER_INFO = gql`
    query {
        getUserInfo {
            id
            name
            email
            features
        }
    }
`;
