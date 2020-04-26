import {gql} from 'apollo-boost';

export const LOGIN = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

export const LOGOUT = gql`
    mutation($key: String!) {
        logout(key: $key)
    }
`;
