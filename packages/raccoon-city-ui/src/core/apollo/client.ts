import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {createUploadLink} from 'apollo-upload-client';

export const client = new ApolloClient({
    link: createUploadLink({uri: 'http://localhost:4000'}),
    cache: new InMemoryCache()
});
