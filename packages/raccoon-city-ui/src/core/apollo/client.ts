import {ApolloLink} from 'apollo-boost';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import {createUploadLink} from 'apollo-upload-client';
import Cookies from 'js-cookie';
import {TOKEN} from '../constants';

const httpLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URL
});

const authLink = setContext((_, {headers}) => {
    const token = Cookies.get(TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? token : ''
        }
    };
});

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({extensions, message, locations, path}) => {
            if (extensions?.code === 'UNAUTHENTICATED') {
                window.location.href = '/login';
                return;
            }

            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
    }

    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

export const client = new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache: new InMemoryCache()
});
