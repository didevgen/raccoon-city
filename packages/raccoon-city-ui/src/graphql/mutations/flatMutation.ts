import {gql} from 'apollo-boost';

export const UPDATE_FLAT = gql`
    mutation updateFlat($flat: HouseFlatInput) {
        updateFlat(flat: $flat) {
            id
            flatNumber
            price
            level
            entrance
            area
            status
            roomAmount
        }
    }
`;

export const CREATE_FLAT = gql`
    mutation createFlat($houseGuid: String, $flat: HouseFlatInput) {
        createFlat(houseGuid: $houseGuid, flat: $flat) {
            id
            flatNumber
            price
            level
            entrance
            area
            status
            roomAmount
        }
    }
`;

export const DELETE_FLAT = gql`
    mutation deleteFlat($uuid: String) {
        deleteFlat(uuid: $uuid)
    }
`;
