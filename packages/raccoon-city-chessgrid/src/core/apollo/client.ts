import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URL
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions, message, locations, path }) => {
      if (extensions?.code === "UNAUTHENTICATED") {
        window.location.href = "/login";
        return;
      }

      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache()
});
