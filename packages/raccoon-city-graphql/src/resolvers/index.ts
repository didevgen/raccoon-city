import {apartmentComplex as apartmentComplexMutation} from './mutations/apartmentComplex';
import {flatMutation} from './mutations/flat';
import {house as houseMutation} from './mutations/house';
import {layoutMutation} from './mutations/layout';
import {levelMutation} from './mutations/level';
import {apartmentComplex as apartmentComplexQuery} from './queries/apartmentComplex.resolver';
import {constants} from './queries/constants.resolver';
import {hosueQuery} from './queries/house.resolver';
import {layoutQuery} from './queries/layout';
import {levelQuery} from './queries/level.resolver';
import {flatQuery} from './queries/flat.resolver';

export default {
    Query: {
        ...constants,
        ...apartmentComplexQuery,
        ...hosueQuery,
        ...layoutQuery,
        ...levelQuery,
        ...flatQuery
    },
    Mutation: {
        ...apartmentComplexMutation,
        ...houseMutation,
        ...flatMutation,
        ...layoutMutation,
        ...levelMutation
    }
};
