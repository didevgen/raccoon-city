import {gql} from 'apollo-boost';

export const GET_SECTION = gql`
    query getSectionData($sectionId: String!) {
        getSectionData(sectionId: $sectionId) {
            id
            section
            levels {
                id
                level
                flats {
                    id
                    flatNumber
                    price
                    level
                    section
                    area
                    status
                    roomAmount
                }
            }
        }
    }
`;

export const GET_MAX_LEVEL = gql`
    query getMaxLevelInSection($sectionId: String!) {
        getMaxLevelInSection(sectionId: $sectionId)
    }
`;
