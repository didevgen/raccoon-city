import {gql} from 'apollo-boost';

export const CREATE_APARTMENT_COMPLEX = gql`
    mutation createComplex($apartmentComplex: ApartmentComplexInput) {
        createApartmentComplex(apartmentComplex: $apartmentComplex) {
            id
        }
    }
`;

export const UPLOAD_FILE = gql`
    mutation addImage($file: Upload!) {
        addImage(file: $file) {
            downloadUrl
        }
    }
`;
