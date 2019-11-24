import {gql} from 'apollo-boost';

export const ALL_APARTMENT_COMPLEXES = gql`
    {
        getAllApartmentComplexes {
            id
            name
            images {
                CHESS_GRID {
                    uuid
                    downloadUrl
                }
            }
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

export const APARTMENT_COMPLEX_IMAGES = gql`
    query getApartmentComplex($uuid: String!) {
        getApartmentComplex(uuid: $uuid) {
            images {
                CHESS_GRID {
                    uuid
                    downloadUrl
                }
                SITE {
                    uuid
                    downloadUrl
                }
                MOBILE {
                    uuid
                    downloadUrl
                }
                PHOTO {
                    uuid
                    downloadUrl
                    name
                }
                VR {
                    uuid
                    downloadUrl
                    name
                }
                HALF_VR {
                    uuid
                    downloadUrl
                    name
                }
            }
        }
    }
`;
