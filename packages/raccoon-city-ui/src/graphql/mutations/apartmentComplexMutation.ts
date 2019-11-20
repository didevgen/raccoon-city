import {gql} from 'apollo-boost';

export const CREATE_APARTMENT_COMPLEX = gql`
    mutation createComplex($apartmentComplex: ApartmentComplexInput) {
        createApartmentComplex(apartmentComplex: $apartmentComplex) {
            id
        }
    }
`;
