import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {createUploadLink} from 'apollo-upload-client';

export const client = new ApolloClient({
    link: createUploadLink({uri: process.env.REACT_APP_GRAPHQL_URL}),
    cache: new InMemoryCache()
});
