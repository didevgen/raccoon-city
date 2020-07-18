import {gql} from 'apollo-boost';

export const ALL_CONTACTS = gql`
    query getAllContacts($developerUuid: String!) {
        getAllContacts(developerUuid: $developerUuid) {
            id
            name
            email
            phones
            position
            clientStatus
        }
    }
`;

export const GET_CONTACT = gql`
    query getContact($uuid: String!) {
        getContact(uuid: $uuid) {
            id
            name
            email
            phones
            position
            clientStatus
            responsible {
                id
                name
                role {
                    key
                    displayName
                }
            }
        }
    }
`;

export const GET_CONTACT_DROPDOWNS = gql`
    query getContactsDropdowns {
        clientStatuses {
            key
            displayName
        }
    }
`;
