import {gql} from 'apollo-boost';

export const CREATE_LAYOUT = gql`
    mutation createLayout($uuid: String!, $file: Upload!, $name: String!) {
        createLayout(houseId: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;

export const EDIT_LAYOUT = gql`
    mutation editLayout($uuid: String!, $file: Upload, $name: String!) {
        editLayout(uuid: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;

export const EDIT_LEVEL_LAYOUT = gql`
    mutation editLevelLayout($uuid: String!, $file: Upload, $name: String!) {
        editLevelLayout(uuid: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;

export const CREATE_LEVEL_LAYOUT = gql`
    mutation createLevelLayout($uuid: String!, $file: Upload!, $name: String!) {
        createLevelLayout(houseId: $uuid, file: $file, name: $name) {
            id
            name
        }
    }
`;

export const ASSIGN_FLATS_TO_LAYOUT = gql`
    mutation assignFlatsToLayout($layoutId: String!, $flats: [String]) {
        assignFlatsToLayout(layoutId: $layoutId, flats: $flats) {
            id
        }
    }
`;

export const ASSIGN_LEVELS_TO_LAYOUT = gql`
    mutation assignLevelsToLayout($levelLayoutId: String!, $levels: [String]) {
        assignLevelsToLayout(levelLayoutId: $levelLayoutId, levels: $levels)
    }
`;

export const ASSIGN_FLAT_LAYOUT_TO_LEVEL = gql`
    mutation assignFlatLayoutsToLevel(
        $levelLayoutId: String!
        $flatLayoutId: String
        $path: [String]
        $viewBox: ViewBoxInput
    ) {
        assignFlatLayoutsToLevel(
            levelLayoutId: $levelLayoutId
            flatLayoutId: $flatLayoutId
            path: $path
            viewBox: $viewBox
        )
    }
`;

export const ASSIGN_FLAT_LAYOUT_TO_LEVEL_LAYOUT = gql`
    mutation assignFlatLayoutsToLevelLayout($layoutAssignmentId: String!, $flatLayoutId: String) {
        assignFlatLayoutsToLevelLayout(layoutAssignmentId: $layoutAssignmentId, flatLayoutId: $flatLayoutId)
    }
`;

export const UNASSIGN_FLAT_LAYOUT_TO_LEVEL_LAYOUT = gql`
    mutation unassignFlatLayoutsToLevelLayout($layoutAssignmentId: String!) {
        unassignFlatLayoutsToLevelLayout(layoutAssignmentId: $layoutAssignmentId)
    }
`;

export const DELETE_FLAT_LAYOUT = gql`
    mutation deleteFlatLayout($uuid: String!) {
        deleteFlatLayout(uuid: $uuid)
    }
`;

export const DELETE_LEVEL_LAYOUT = gql`
    mutation deleteLevelLayout($uuid: String!) {
        deleteLevelLayout(uuid: $uuid)
    }
`;

export const DELETE_FLAT_LAYOUT_TO_LEVEL_LAYOUT = gql`
    mutation deleteFlatLayoutsToLevelLayout($layoutAssignmentId: String!) {
        deleteFlatLayoutsToLevelLayout(layoutAssignmentId: $layoutAssignmentId)
    }
`;

export const UPLOAD_IMAGE = gql`
    mutation addFlatLayoutImage($file: Upload!, $mode: String!, $uuid: String!, $name: String) {
        addFlatLayoutImage(file: $file, mode: $mode, uuid: $uuid, name: $name) {
            downloadUrl
        }
    }
`;

export const DELETE_IMAGE = gql`
    mutation deleteFlatLayoutImage($mode: String!, $uuid: String!, $imageId: String!) {
        deleteFlatLayoutImage(mode: $mode, uuid: $uuid, imageId: $imageId)
    }
`;
