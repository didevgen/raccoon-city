import {gql} from 'apollo-boost';

export const UPDATE_FLAT = gql`
    mutation updateFlat($flat: HouseFlatInput) {
        updateFlat(flat: $flat) {
            id
            flatNumber
            levelAmount
            price
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
            levelAmount
            price
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

export const ADD_LEVEL = gql`
    mutation addLevel($sectionId: String!) {
        addLevel(sectionId: $sectionId)
    }
`;

export const DELETE_LEVEL = gql`
    mutation deleteLevel($levelId: String!) {
        deleteLevel(levelId: $levelId)
    }
`;

export const DELETE_SECTION = gql`
    mutation deleteSection($sectionId: String!) {
        deleteSection(sectionId: $sectionId)
    }
`;
