import {gql} from 'apollo-boost';

export const GET_HISTORY = gql`
    query getHistory($apartmentComplexId: String!) {
        getHistory(apartmentComplexId: $apartmentComplexId) {
            id
            name
            timestamp
            downloadUrl
        }
    }
`;
