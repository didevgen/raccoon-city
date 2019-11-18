import {Subscription} from './Subscription';
import {auth} from './Mutation/auth';
import {post} from './Mutation/post';
import {User} from './User';
import {Post} from './Post';
import {city} from "./queries/city.resolver";

export default {
    Query: {
        ...city
    },
    Mutation: {
        ...auth,
        ...post
    },
    Subscription,
    User,
    Post
};
