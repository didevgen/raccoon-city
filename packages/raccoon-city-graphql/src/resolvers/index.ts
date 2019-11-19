import {constants} from './queries/constants.resolver';
import {apartmentComplex} from './mutations/apartmentComplex';

export default {
    Query: {
        ...constants
    },
    Mutation: {
        ...apartmentComplex
    }
};
