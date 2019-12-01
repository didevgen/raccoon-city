import {constants} from './queries/constants.resolver';
import {apartmentComplex as apartmentComplexQuery} from './queries/apartmentComplex.resolver';
import {apartmentComplex as apartmentComplexMutation} from './mutations/apartmentComplex';
import {house as houseMutation} from './mutations/house';

export default {
    Query: {
        ...constants,
        ...apartmentComplexQuery
    },
    Mutation: {
        ...apartmentComplexMutation,
        ...houseMutation
    }
};
