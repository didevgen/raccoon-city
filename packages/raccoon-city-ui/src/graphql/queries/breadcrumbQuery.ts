import {gql} from 'apollo-boost';

export const GET_BREADCRUMBS = gql`
    query getBreadcrumbs($args: BreadcrumbArgs) {
        getBreadcrumbs(args: $args) {
            name
            url
        }
    }
`;
