import {gql} from 'apollo-boost';

export const CREATE_CONTACT = gql`
    mutation createContact($developerUuid: String!, $contact: ContactInput!) {
        createContact(developerUuid: $developerUuid, contact: $contact) {
            id
        }
    }
`;

export const UPDATE_CONTACT = gql`
    mutation updateContact($uuid: String!, $contact: ContactInput!) {
        updateContact(uuid: $uuid, contact: $contact) {
            id
        }
    }
`;

export const DELETE_CONTACT = gql`
    mutation deleteContact($uuid: String!) {
        deleteContact(uuid: $uuid)
    }
`;
