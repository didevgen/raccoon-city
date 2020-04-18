import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {createUploadLink} from 'apollo-upload-client';
import {ViewModeValues} from '../../components/Main/ChessGrid/ChessGrid';

const cache = new InMemoryCache();

export const client = new ApolloClient({
    link: createUploadLink({uri: process.env.REACT_APP_GRAPHQL_URL}),
    cache
});

cache.writeData({
    data: {
        selectedViewMode: ViewModeValues.AREA
    }
});
