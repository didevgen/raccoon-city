import {gql} from 'apollo-boost';

export const ALL_APARTMENT_COMPLEXES = gql`
    {
        getAllApartmentComplexes {
            id
            name
        }
    }
`;

export const APARTMENT_COMPLEX_DROPDOWNS = gql`
    {
        cities {
            key
            displayName
            districts {
                key
                displayName
            }
        }
        apartmentComplexClasses {
            key
            displayName
        }
        apartmentComplexTypes {
            key
            displayName
        }
    }
`;
