import {constants} from './queries/constants.resolver';
import {apartmentComplex as apartmentComplexQuery} from './queries/apartmentComplex.resolver';
import {apartmentComplex as apartmentComplexMutation} from './mutations/apartmentComplex';
import {house as houseMutation} from './mutations/house';
import {hosueQuery} from './queries/house.resolver';

export default {
    Query: {
        ...constants,
        ...apartmentComplexQuery,
        ...hosueQuery
    },
    Mutation: {
        ...apartmentComplexMutation,
        ...houseMutation
    }
};
