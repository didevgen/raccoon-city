import {apartmentComplex as apartmentComplexMutation} from './mutations/apartmentComplex';
import {auth} from './mutations/auth';
import {developerMutation} from './mutations/developer';
import {flatMutation} from './mutations/flat';
import {house as houseMutation} from './mutations/house';
import {layoutMutation} from './mutations/layout';
import {levelMutation} from './mutations/level';
import {apartmentComplex as apartmentComplexQuery} from './queries/apartmentComplex.resolver';
import {constants} from './queries/constants.resolver';
import {developerQuery} from './queries/developer.resolver';
import {fileHistoryQuery} from './queries/fileHistory.resolver';
import {flatQuery} from './queries/flat.resolver';
import {hosueQuery} from './queries/house.resolver';
import {layoutQuery} from './queries/layout';
import {levelQuery} from './queries/level.resolver';
import {user} from './queries/user';
import {breadcrumbQuery} from './queries/breadcrumb.resolver';
import {contactsQuery} from './queries/contacts.resolver';
import {contactsMutation} from './mutations/contact';

export default {
    Query: {
        ...constants,
        ...apartmentComplexQuery,
        ...hosueQuery,
        ...layoutQuery,
        ...levelQuery,
        ...flatQuery,
        ...developerQuery,
        ...fileHistoryQuery,
        ...user,
        ...breadcrumbQuery,
        ...contactsQuery
    },
    Mutation: {
        ...apartmentComplexMutation,
        ...houseMutation,
        ...flatMutation,
        ...layoutMutation,
        ...levelMutation,
        ...developerMutation,
        ...contactsMutation,
        ...auth
    }
};
