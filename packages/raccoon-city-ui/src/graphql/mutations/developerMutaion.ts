import {gql} from 'apollo-boost';

export const CREATE_DEVELOPER = gql`
    mutation createDeveloper($developerData: DeveloperInput!, $image: Upload) {
        createDeveloper(developerData: $developerData, image: $image) {
            id
        }
    }
`;

export const UPDATE_DEVELOPER = gql`
    mutation updateDeveloper($id: String!, $developerData: DeveloperInput!, $image: Upload) {
        updateDeveloper(id: $id, developerData: $developerData, image: $image) {
            id
        }
    }
`;
