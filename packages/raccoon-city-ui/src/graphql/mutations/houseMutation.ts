import {gql} from 'apollo-boost';

export const CREATE_HOUSE = gql`
    mutation createHouse($apartmentComplexId: String!, $houseData: HouseInput!) {
        createHouse(apartmentComplexId: $apartmentComplexId, houseData: $houseData) {
            name
        }
    }
`;

export const UPLOAD_FILE = gql`
    mutation addHouseImage($file: Upload!, $mode: String!, $uuid: String!, $name: String) {
        addHouseImage(file: $file, mode: $mode, uuid: $uuid, name: $name) {
            downloadUrl
        }
    }
`;

export const DELETE_HOUSE = gql`
    mutation deleteHouse($uuid: String!) {
        deleteHouse(uuid: $uuid)
    }
`;

export const UPDATE_HOUSE = gql`
    mutation updateHouse($uuid: String!, $houseData: HouseInput!) {
        updateHouse(uuid: $uuid, houseData: $houseData) {
            name
        }
    }
`;

export const DELETE_IMAGE = gql`
    mutation deleteHouseImage($mode: String!, $uuid: String!, $imageId: String!) {
        deleteHouseImage(mode: $mode, uuid: $uuid, imageId: $imageId)
    }
`;

export const REORDER_LEVELS = gql`
    mutation reorderLevels($sectionId: String!, $oldIndex: Int!, $newIndex: Int!) {
        reorderLevels(sectionId: $sectionId, oldIndex: $oldIndex, newIndex: $newIndex)
    }
`;
