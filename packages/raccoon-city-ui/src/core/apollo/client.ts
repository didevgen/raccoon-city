import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {setContext} from 'apollo-link-context';
import {createHttpLink} from 'apollo-link-http';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL
});

const authLink = setContext((_, {headers}) => {
    const token = Cookies.get('token');
    return {
        headers: {
            ...headers,
            authorization: token ? token : ''
        }
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
