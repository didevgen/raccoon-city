import {gql} from 'apollo-boost';

export const GET_USER_INFO = gql`
    query getUserInfo {
        getUserInfo {
            id
            name
            email
            features
        }
    }
`;

export const GET_USERS = gql`
    query getUsers {
        getUsers {
            id
            name
            email
            features
            isDeleted
        }
    }
`;
