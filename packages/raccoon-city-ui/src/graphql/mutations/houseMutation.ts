import {gql} from 'apollo-boost';

export const CREATE_HOUSE = gql`
    mutation createHouse($apartmentComplexId: String!, $houseData: HouseInput!) {
        createHouse(apartmentComplexId: $apartmentComplexId, houseData: $houseData) {
            name
        }
    }
`;
