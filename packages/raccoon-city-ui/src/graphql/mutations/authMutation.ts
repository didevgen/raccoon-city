import {gql} from 'apollo-boost';

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

export const LOGOUT = gql`
    mutation logout($key: String!) {
        logout(key: $key)
    }
`;
