import {constants} from './queries/constants.resolver';
import {apartmentComplex as apartmentComplexQuery} from './queries/apartmentComplex.resolver';
import {apartmentComplex as apartmentComplexMutation} from './mutations/apartmentComplex';
import {house as houseMutation} from './mutations/house';
import {flatMutation} from './mutations/flat';
import {layoutMutation} from './mutations/layout';
import {hosueQuery} from './queries/house.resolver';
import {layoutQuery} from './queries/layout';

export default {
    Query: {
        ...constants,
        ...apartmentComplexQuery,
        ...hosueQuery,
        ...layoutQuery
    },
    Mutation: {
        ...apartmentComplexMutation,
        ...houseMutation,
        ...flatMutation,
        ...layoutMutation
    }
};
