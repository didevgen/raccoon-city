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

export const DELETE_IMAGE = gql`
    mutation deleteHouseImage($mode: String!, $uuid: String!, $imageId: String!) {
        deleteHouseImage(mode: $mode, uuid: $uuid, imageId: $imageId)
    }
`;
