import {gql} from 'apollo-boost';

export const GET_LAYOUTS = gql`
    query getLayouts($houseId: String!) {
        getLayouts(houseId: $houseId) {
            id
            name
            image {
                downloadUrl
                previewImageUrl
            }
        }
    }
`;
