import {gql} from 'apollo-boost';

export const CREATE_APARTMENT_COMPLEX = gql`
    mutation createComplex($apartmentComplex: ApartmentComplexInput!) {
        createApartmentComplex(apartmentComplex: $apartmentComplex) {
            id
        }
    }
`;

export const UPLOAD_FILE = gql`
    mutation addImage($file: Upload!, $mode: String!, $uuid: String!, $name: String) {
        addImage(file: $file, mode: $mode, uuid: $uuid, name: $name) {
            downloadUrl
        }
    }
`;

export const DELETE_IMAGE = gql`
    mutation deleteImage($mode: String!, $uuid: String!, $imageId: String!) {
        deleteImage(mode: $mode, uuid: $uuid, imageId: $imageId)
    }
`;

export const UPLOAD_SPREADSHEET = gql`
    mutation uploadApartmentComplexFile($file: Upload!, $uuid: String!) {
        uploadApartmentComplexFile(file: $file, uuid: $uuid)
    }
`;
