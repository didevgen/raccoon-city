import {gql} from 'apollo-boost';

export const DEVELOPER_DROPDOWNS = gql`
    {
        cities {
            key
            displayName
            districts {
                key
                displayName
            }
        }
    }
`;

export const GET_DEVELOPERS = gql`
    query getDevelopers {
        getDevelopers {
            id
            name
            city
            address
            emails
            receptionNumbers
            salesNumbers
            logo {
                uuid
                downloadUrl
            }
        }
    }
`;

export const GET_DEVELOPER = gql`
    query getDeveloper($uuid: String!) {
        getDeveloper(uuid: $uuid) {
            id
            name
            city
            address
            emails
            receptionNumbers
            salesNumbers
            logo {
                uuid
                downloadUrl
            }
        }
    }
`;
