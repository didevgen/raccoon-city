import {gql} from 'apollo-boost';

export const LOGIN = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;
